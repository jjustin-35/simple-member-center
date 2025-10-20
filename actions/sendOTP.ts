"use server";

import { ApiState } from "@/types/api";
import { createClient } from "@/utils/supabase/server";

export const sendOTP = async (): Promise<ApiState> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("no user data");
    const { phone } = user;

    
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "fail to send OTP",
      errors: {},
    };
  }
};
