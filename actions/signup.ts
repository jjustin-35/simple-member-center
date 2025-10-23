"use server";

import { ApiState } from "@/types/api";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/helpers/validate";
import { createClient } from "@/utils/supabase/server";

type SignupFormState = ApiState<{
  email?: string;
  password?: string;
  phone?: string;
}>;

export async function signupAction(
  _: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const openOTP = formData.get("open-otp") as string;

  const errors: SignupFormState["errors"] = {};

  // Validate email
  if (!email) {
    errors.email = "請輸入電子郵件";
  } else if (!validateEmail(email)) {
    errors.email = "請輸入有效的電子郵件格式";
  }

  // Validate password
  if (!password) {
    errors.password = "請輸入密碼";
  } else if (!validatePassword(password)) {
    errors.password = "密碼至少需要6個字元";
  }

  if (!phone) {
    errors.phone = "請輸入電話號碼";
  } else if (!validatePhone(phone)) {
    errors.phone = "請輸入正確格式的電話號碼";
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "請修正表單錯誤",
      errors,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      phone,
      options: {
        data: {
          open_otp: openOTP === "true",
        },
      },
    });
    if (error) throw error;
    if (!data) throw new Error("no user data");

    return {
      success: true,
      message: "註冊成功！",
      errors: {},
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "註冊失敗，請稍後再試",
      errors: {},
    };
  }
}
