"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { clearOTP, registerOTP } from "@/actions/otp";
import OtpVerify from "./OtpVerify";

const OtpForm = ({ user }: { user: User }) => {
  const { is_otp_enabled } = user.user_metadata;
  const [isOpenOTP, setIsOpenOTP] = useState(is_otp_enabled);
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpenOTP && otpUrl) {
      dialogRef.current?.showModal();
    }
  }, [isOpenOTP, otpUrl]);

  const onToggleOTP = async () => {
    const newIsOpenOTP = !isOpenOTP;
    setIsOpenOTP(newIsOpenOTP);
    if (newIsOpenOTP) {
      const otpData = await registerOTP();
      if (otpData) {
        setOtpUrl(otpData.data);
      }
      return;
    }
    await clearOTP();
    setOtpUrl(null);
  };

  const onCancel = () => {
    setOtpUrl(null);
    setIsOpenOTP(false);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          id="open-otp"
          name="open-otp"
          type="checkbox"
          checked={isOpenOTP}
          onChange={onToggleOTP}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="open-otp" className="ml-2 block text-sm text-gray-900">
          開啟 OTP 驗證
        </label>
      </div>
      <OtpVerify dialogRef={dialogRef} otpUrl={otpUrl} onCancel={onCancel} />
    </div>
  );
};

export default OtpForm;
