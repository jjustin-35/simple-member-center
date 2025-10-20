'use server';

import { validateEmail, validatePassword } from '@/helpers/validate';

export interface LoginFormState {
  success: boolean;
  message: string;
  errors: {
    email?: string;
    password?: string;
  };
}

export async function loginAction(
  _: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const errors: LoginFormState['errors'] = {};
  
  // Validate email
  if (!email) {
    errors.email = '請輸入電子郵件';
  } else if (!validateEmail(email)) {
    errors.email = '請輸入有效的電子郵件格式';
  }
  
  // Validate password
  if (!password) {
    errors.password = '請輸入密碼';
  } else if (!validatePassword(password)) {
    errors.password = '密碼至少需要6個字元';
  }
  
  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: '請修正表單錯誤',
      errors,
    };
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically call your authentication API
    // For demo purposes, we'll simulate a successful login
    console.log('Login attempt:', { email, password });
    
    return {
      success: true,
      message: '登入成功！',
      errors: {},
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: '登入失敗，請稍後再試',
      errors: {},
    };
  }
}
