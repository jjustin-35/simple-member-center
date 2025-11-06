"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";

export const socialLogin = async (provider: Provider, token: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider,
      token: token as string,
    });
    if (error) throw error;
    return { success: true, message: "Social login successful", data: data };
  } catch (error) {
    console.error("Social login failed:", error);
    return {
      success: false,
      message: "Social login failed",
      error: error as Error,
    };
  }
};
