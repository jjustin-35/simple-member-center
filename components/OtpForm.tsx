"use client";

import { useEffect, useState, useRef } from "react";
import { getOTPData, registerOTP } from "@/actions/otp";
import OtpVerify from "./OtpVerify";

const OtpForm = () => {
  const [isOpenOTP, setIsOpenOTP] = useState(false);
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await getOTPData();
      if (!data) return;
      setIsOpenOTP(data.is_otp_enabled);
      setOtpUrl(data.otpauthURL);
    })();
  }, []);

  const onOpenOTP = () => {
    setIsOpenOTP(!isOpenOTP);
    dialogRef.current?.showModal();
    (async () => {
      const otpData = await registerOTP();
      if (otpData) {
        setOtpUrl(otpData.data.otpauthURL);
      }
    })();
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          id="open-otp"
          name="open-otp"
          type="checkbox"
          checked={isOpenOTP}
          onChange={onOpenOTP}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="open-otp" className="ml-2 block text-sm text-gray-900">
          開啟 OTP 驗證
        </label>
      </div>
      <OtpVerify dialogRef={dialogRef} otpUrl={otpUrl} />
    </div>
  );
};

export default OtpForm;
