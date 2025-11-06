"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import crypto from "crypto";

const encodeToken = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const generateNonce = async () => {
  const plainNonce = crypto.randomUUID();
  const encodedNonce = await encodeToken(plainNonce);
  return {
    plainNonce,
    encodedNonce,
  };
};

export const socialLogin = async (
  provider: Provider,
  token: string,
  nonce?: string
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider,
      token: token as string,
      nonce,
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
