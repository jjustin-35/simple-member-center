"use client";

import { useActionState, startTransition, useEffect, useState } from "react";
import { ApiState } from "@/types/api";
import { verifyOTP } from "@/actions/otp";
import OtpRegister from "./OtpRegister";
import VerifySuccess from "./VerifySuccess";
import Backup from "./Backup";

const initialState: ApiState<{
  otp?: string;
}> = {
  success: false,
  message: "",
  errors: {},
};

const VerifyForm = ({
  onFinish,
  onVerifyBackupCode,
  isInitialOTP,
}: {
  onFinish: () => void;
  onVerifyBackupCode: () => void;
  isInitialOTP: boolean;
}) => {
  const [state, formAction, isPending] = useActionState(
    (_: ApiState, formData: FormData) => verifyOTP(_, formData, isInitialOTP),
    initialState
  );

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 1000);
    }
  }, [state.success]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  };

  if (state.success) return <VerifySuccess />;
  return (
    <form
      onSubmit={onSubmit}
      className="h-40 flex flex-col items-center justify-end"
    >
      <input
        type="text"
        placeholder="OTP"
        name="token"
        required
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={6}
        className="mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      />
      {state.errors?.otp && (
        <p className="mt-1 text-sm text-red-600 w-full">{state.errors?.otp}</p>
      )}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
      >
        {isPending ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            驗證 OTP 中...
          </div>
        ) : (
          "驗證 OTP"
        )}
      </button>
      <div className="mt-4 text-sm text-gray-500 text-center">
        無法成功驗證?
        <a
          className="text-indigo-600 cursor-pointer underline"
          onClick={onVerifyBackupCode}
        >
          使用備份碼驗證
        </a>
      </div>
    </form>
  );
};

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
    return () => {
      setIsVerifying(false);
      setIsVerifyingBackup(false);
    };
  }, []);

  const handleNextStep = () => {
    setIsVerifying(true);
  };

  const handleCancel = () => {
    setIsVerifying(false);
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
    if (isVerifyingBackup) {
      return <Backup onFinish={handleFinish} />;
    }

    if (!otpUrl || isVerifying) {
      return (
        <VerifyForm
          onFinish={handleFinish}
          onVerifyBackupCode={handleVerifyBackupCode}
          isInitialOTP={!!otpUrl}
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
