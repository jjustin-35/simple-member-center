"use client";

import { useEffect, useState } from "react";
import OtpRegister from "./OtpRegister";
import VerifyForm from "./VerifyForm";
import BackupVerify from "../Backup/BackupVerify";

const OtpVerify = ({
  dialogRef,
  otpUrl,
  otpSecret,
  onCancel,
  onFinish,
  isModal = true,
}: {
  dialogRef?: React.RefObject<HTMLDialogElement>;
  otpUrl?: string;
  otpSecret?: string;
  isModal?: boolean;
  onCancel?: () => void;
  onFinish?: () => void;
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifyingBackup, setIsVerifyingBackup] = useState(false);

  useEffect(() => {
    return () => reset();
  }, []);

  const reset = () => {
    setIsVerifying(false);
    setIsVerifyingBackup(false);
  };

  const handleNextStep = () => {
    setIsVerifying(true);
  };

  const handleCancel = () => {
    reset();
    if (onCancel) onCancel();
    if (dialogRef) dialogRef.current?.close();
  };

  const handleFinish = () => {
    if (onFinish) onFinish();
    if (dialogRef) dialogRef.current?.close();
  };

  const handleVerifyBackupCode = () => {
    setIsVerifyingBackup(true);
  };

  const content = (() => {
    if (!otpUrl && isVerifyingBackup) {
      return <BackupVerify onFinish={handleFinish} />;
    }

    if (!otpUrl || isVerifying) {
      return (
        <VerifyForm
          onFinish={handleFinish}
          onVerifyBackupCode={handleVerifyBackupCode}
          isInitialOTP={!!otpUrl}
          tempOTPSecret={otpSecret || ""}
        />
      );
    }

    return (
      <OtpRegister
        otpUrl={otpUrl}
        otpSecret={otpSecret}
        onNextStep={handleNextStep}
      />
    );
  })();

  if (isModal)
    return (
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black backdrop:opacity-50 backdrop:backdrop-blur-sm fixed inset-0 m-auto max-w-md max-h-fit rounded-lg shadow-lg border-0 p-0 bg-transparent"
      >
        <div className="bg-white p-4 flex flex-col items-center justify-center rounded-lg">
          <button onClick={handleCancel} className="text-2xl self-start">
            x
          </button>
          {content}
        </div>
      </dialog>
    );

  return <div className="flex items-center justify-center">{content}</div>;
};

export default OtpVerify;
