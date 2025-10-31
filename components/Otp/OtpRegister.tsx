"use client";

import { useState } from "react";
import QRCode from "../QRCode";

const OtpRegister = ({
  otpUrl,
  otpSecret,
  onNextStep,
}: {
  otpUrl: string;
  otpSecret: string;
  onNextStep: () => void;
}) => {
  const [isShowingSecret, setIsShowingSecret] = useState(false);

  const toggleShowSecret = () => {
    setIsShowingSecret(!isShowingSecret);
  };

  return (
    <div className="w-80 h-100 flex flex-col items-center justify-center">
      <p className="text-sm text-gray-500 text-center">
        請使用 Google Authenticator 掃描 QR Code 或<br />
        手動輸入 OTP 密碼
      </p>
      {!isShowingSecret && (
        <>
          <QRCode data={otpUrl} />
          <div className="mt-4 text-sm">
            無法掃描 QR Code 嗎？
            <br />
            <a
              className="text-indigo-600 cursor-pointer underline"
              onClick={toggleShowSecret}
            >
              顯示設定金鑰
            </a>
          </div>
        </>
      )}
      {isShowingSecret && otpSecret && (
        <>
          <div className="text-sm text-gray-500">
            <p>OTP 密碼: {otpSecret}</p>
          </div>
          <div className="mt-4 text-sm">
            <a
              className="text-indigo-600 cursor-pointer underline"
              onClick={toggleShowSecret}
            >
              顯示 QR Code
            </a>
          </div>
        </>
      )}

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
        onClick={onNextStep}
      >
        下一步
      </button>
    </div>
  );
};

export default OtpRegister;
