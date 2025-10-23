"use server";

import { randomBytes } from "crypto";
import { ApiState } from "@/types/api";
import { createClient } from "@/utils/supabase/server";

const getOTP = (): { otp: string; expiresAt: Date } => {
  const otp = randomBytes(6).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);
  return { otp, expiresAt };
};

export const generateOTP = async (): Promise<ApiState> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user || error) throw new Error("no user data");
    const { phone, user_metadata } = user;
    if (!phone || !user_metadata?.open_otp)
      throw new Error("no phone or open_otp");

    if (
      user_metadata?.otp &&
      user_metadata?.otp_expires_at &&
      user_metadata?.otp_expires_at > Date.now()
    ) {
      throw new Error("OTP already generated");
    }

    const { otp, expiresAt } = getOTP();

    const { error: updateError } = await supabase
      .from("users")
      .update({
        otp,
        otp_expires_at: expiresAt,
      })
      .eq("id", user.id);
    if (updateError) throw updateError;

    return {
      success: true,
      message: "OTP generated successfully",
      data: { otp, phone },
      errors: {},
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "fail to generate OTP",
      errors: {},
    };
  }
};
