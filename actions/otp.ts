"use server";

import speakeasy from "speakeasy";
import { createClient } from "@/utils/supabase/server";
import { ApiState } from "@/types/api";

export const getOTPData = async (): Promise<ApiState> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const { is_otp_enabled, temp_otp_secret, otp_secret } =
      data?.user?.user_metadata || {};
    return {
      success: true,
      message: "OTP data retrieved successfully",
      data: { is_otp_enabled, temp_otp_secret, otp_secret },
    };
  } catch (error) {
    console.error("Get OTP data error:", error);
  }
};

export const registerOTP = async () => {
  const { base32: tempSecret, otpauth_url: otpauthURL } =
    speakeasy.generateSecret({
      name: "OTP",
      issuer: "OTP-Sample",
    });

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: {
        temp_otp_secret: tempSecret,
      },
    });
    if (error) throw error;
    if (!data) throw new Error("no user data");

    return {
      success: true,
      message: "OTP registered successfully",
      data: {
        temp_secret: tempSecret,
        otpauthURL: otpauthURL,
      },
    };
  } catch (error) {
    console.error("Generate OTP error:", error);
    return null;
  }
};

export const verifyOTP = async (
  _: ApiState,
  formData: FormData
): Promise<ApiState> => {
  const token = formData.get("token") as string;
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

    const { temp_otp_secret, otp_secret } = data?.user?.user_metadata || {};
    if (!temp_otp_secret && !otp_secret) throw new Error("no otp registered");
    const isInitialOTP = !otp_secret;
    const secret = isInitialOTP ? temp_otp_secret : otp_secret;
    const isVerified = speakeasy.totp.verify({
      secret,
      token,
      encoding: "base32",
    });
    if (!isVerified) throw new Error("invalid otp");

    if (isInitialOTP) {
      await supabase.auth.updateUser({
        data: {
          otp_secret: secret,
          is_otp_enabled: true,
        },
      });
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
      errors: {},
    };
  }
};

export const clearOTP = async (): Promise<ApiState> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: {
        is_otp_enabled: false,
        temp_otp_secret: null,
        otp_secret: null,
      },
    });
    if (error) throw error;
    if (!data) throw new Error("no user data");
    return { success: true, message: "OTP cleared successfully" };
  } catch (error) {
    console.error("Clear OTP error:", error);
    return { success: false, message: "OTP clearing failed" };
  }
};
