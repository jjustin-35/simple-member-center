"use client";

import { useState, useRef, useTransition } from "react";
import { User } from "@supabase/supabase-js";
import { clearOTP, registerOTP } from "@/actions/otp";
import OtpVerify from "./Otp";

const OtpForm = ({ user }: { user: User }) => {
  const { is_otp_enabled } = user.user_metadata;
  const [isPending, startTransition] = useTransition();
  const [isRegistered, setIsRegistered] = useState(is_otp_enabled);
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const [otpSecret, setOtpSecret] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onRegisterOTP = async () => {
    const otpData = await registerOTP();
    if (otpData) {
      setOtpUrl(otpData.data.otpauthURL);
      setOtpSecret(otpData.data.secret);
      dialogRef.current?.showModal();
    }
  };

  const reset = () => {
    setOtpUrl(null);
    setOtpSecret(null);
    setIsRegistered(false);
    dialogRef.current?.close();
  };

  const onDeleteOTP = async () => {
    const result = await clearOTP();
    if (result.success) {
      reset();
    }
  };

  const onFinish = () => {
    setIsRegistered(true);
    dialogRef.current?.close();
  };

  const onCancel = () => {
    reset();
  };

  return (
    <div className="w-150 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">OTP 設定</h2>
        {!isRegistered && (
          <button
            className="px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
            onClick={() => startTransition(onRegisterOTP)}
          >
            {isPending ? "開啟中..." : "開啟 OTP 驗證"}
          </button>
        )}
      </div>

      <hr className="border-gray-200 my-4" />
      {!isRegistered && (
        <p className="text-lg text-gray-500 text-center p-4">
          尚未開啟 OTP 驗證
        </p>
      )}
      {isRegistered && (
        <div className="flex items-center mb-4 w-full justify-between border-2 border-gray-200 rounded-lg p-4">
          <p className="text-lg font-bold text-gray-500">Authenticator App</p>
          <button
            className="px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
            onClick={onDeleteOTP}
          >
            刪除
          </button>
        </div>
      )}
      <OtpVerify
        dialogRef={dialogRef}
        otpUrl={otpUrl}
        otpSecret={otpSecret}
        onCancel={onCancel}
        onFinish={onFinish}
      />
    </div>
  );
};

export default OtpForm;
