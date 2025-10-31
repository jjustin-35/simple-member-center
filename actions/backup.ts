"use server";

import crypto from "crypto";
import { hash, compare } from "bcrypt";
import { createClient } from "@/utils/supabase/server";
import { ApiState } from "@/types/api";

export const generateBackupCode = (numGroups = 5) => {
  const codes = Array(numGroups)
    .fill(null)
    .map(() => crypto.randomBytes(4).toString("hex"));
  return codes.join("-");
};

export const saveBackupCode = async (codes: string[]) => {
  try {
    const supabase = await createClient();
    const hashedCodes = await Promise.all(
      codes.map(async (code) => await hash(code, 10))
    );

    const { error } = await supabase.auth.updateUser({
      data: {
        backup_codes: hashedCodes,
      },
    });

    if (error) throw error;

    return { success: true, message: "Backup codes saved successfully" };
  } catch (error) {
    console.error("Save backup code error:", error);
    return { success: false, message: "Failed to save backup codes" };
  }
};

export const verifyBackupCode = async (
  _: ApiState<{ code?: string }>,
  formData: FormData
) => {
  const code = formData.get("code") as string;
  if (!code) {
    return {
      success: false,
      message: "Backup code is required",
      errors: { code: "Backup code is required" },
    };
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("no user");

    const hashedCodes = data.user.user_metadata.backup_codes as string[];
    const comparedResults = await Promise.all(
      hashedCodes.map(async (hashedCode) => await compare(code, hashedCode))
    );
    const verifiedCodeIdx = comparedResults.findIndex(Boolean);
    if (verifiedCodeIdx === -1) throw new Error("invalid backup code");
    const { error } = await supabase.auth.updateUser({
      data: {
        backup_codes: hashedCodes.filter((_, idx) => idx !== verifiedCodeIdx),
      },
    });
    if (error) throw error;

    return {
      success: true,
      message: "Backup codes verified successfully",
      errors: {},
    };
  } catch (error) {
    console.error("Verify backup code error:", error);
    return {
      success: false,
      message: "Failed to verify backup codes",
      errors: { code: "Failed to verify backup codes" },
    };
  }
};
