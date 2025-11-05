"use server";

import crypto from "crypto";
import { hash, compare } from "bcrypt";
import { createClient } from "@/utils/supabase/server";
import { ApiState } from "@/types/api";

export const generateBackupCode = async (numGroups = 2) => {
  const codes = Array(numGroups)
    .fill(null)
    .map(() => crypto.randomBytes(2).toString("hex").toUpperCase());
  return codes.join("-");
};

export const saveBackupCode = async (codes: string[]) => {
  try {
    const supabase = await createClient();
    const hashedCodes = await Promise.all(
      codes.map(async (code) => {
        const codeStr = code.replace(/-/g, "");
        let encryptedCode = null; 
        encryptedCode = crypto.createCipheriv("aes-256-cbc", process.env.BACKUP_CODE_SECRET!, process.env.BACKUP_CODE_IV!).update(codeStr);
        
        return {
          code: encryptedCode,
          is_used: false,
        };
      })
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

export const getBackupCodes = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("no user");
  return data.user.user_metadata.backup_codes as string[];
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

  const codeStr = code.replace(/-/g, "");
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("no user");

    const hashedCodes = data.user.user_metadata.backup_codes as {
      code: string;
      is_used: boolean;
    }[];
    let verifiedCode: string | null = null;
    for (const hashedCode of hashedCodes) {
      if (hashedCode.is_used) continue;
      const isVerified = await compare(codeStr, hashedCode.code);
      if (isVerified) {
        verifiedCode = hashedCode.code;
        hashedCode.is_used = true;
        break;
      }
    }
    if (!verifiedCode) throw new Error("invalid backup code");
    const { error } = await supabase.auth.updateUser({
      data: {
        backup_codes: hashedCodes,
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
