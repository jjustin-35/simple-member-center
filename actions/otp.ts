"use server";

import { cookies } from "next/headers";
import speakeasy from "speakeasy";
import { createClient } from "@/utils/supabase/server";
import { ApiState } from "@/types/api";

export const verifyOTP = async (
  _: ApiState,
  formData: FormData,
  optData: {
    isInitialOTP: boolean;
    secret: string;
  }
): Promise<ApiState> => {
  const token = formData.get("token") as string;
  const isTrustDevice = formData.get("isTrustDevice") as string;

  if (!token) {
    return {
      success: false,
      message: "OTP is required",
      errors: { token: "OTP is required" },
    };
  }
  if (token.length !== 6) {
    return {
      success: false,
      message: "OTP is incorrect",
      errors: { token: "OTP is incorrect" },
    };
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (optData.isInitialOTP) {
      const isVerified = speakeasy.totp.verify({
        secret: optData.secret,
        token,
        encoding: "base32",
      });
      if (!isVerified) throw new Error("invalid otp");

      const { error } = await supabase.auth.updateUser({
        data: {
          otp_secret: optData.secret,
          is_otp_enabled: true,
        },
      });
      if (error) throw error;

      return {
        success: true,
        message: "OTP verified successfully",
        errors: {},
      };
    }

    const secret = data?.user?.user_metadata?.otp_secret;
    if (!secret) throw new Error("no otp registered");

    const isVerified = speakeasy.totp.verify({
      secret,
      token,
      encoding: "base32",
    });
    if (!isVerified) throw new Error("invalid otp");

    const cookieStore = await cookies();
    if (isTrustDevice === "true") {
      cookieStore.set("is_trusted_device", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    } else {
      cookieStore.delete("is_trusted_device");
    }

    return {
      success: true,
      message: "OTP verified successfully",
      errors: {},
    };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return {
      success: false,
      message: "OTP verification failed",
      errors: {
        otp: "OTP verification failed",
      },
    };
  }
};

export const clearOTP = async (): Promise<ApiState> => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        is_otp_enabled: false,
        otp_secret: null,
      },
    });
    if (error) throw error;
    return { success: true, message: "OTP cleared successfully" };
  } catch (error) {
    console.error("Clear OTP error:", error);
    return { success: false, message: "OTP clearing failed" };
  }
};

export const registerOTP = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user || error) throw new Error("no user");

    // if otp data exists, clear it
    const clearOTPResult = await clearOTP();
    if (!clearOTPResult.success)
      throw new Error(`failed to clear otp: ${clearOTPResult.message}`);

    const { base32: tempSecret, otpauth_url: otpauthURL } =
      speakeasy.generateSecret({
        name: "OTP-Sample: " + user.email,
        issuer: "OTP-Sample",
      });

    return {
      success: true,
      message: "OTP registered successfully",
      data: {
        secret: tempSecret,
        otpauthURL,
      },
    };
  } catch (error) {
    console.error("Generate OTP error:", error);
    return null;
  }
};
