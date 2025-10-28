"use client";

import { useActionState, startTransition, useEffect, useState } from "react";
import { ApiState } from "@/types/api";
import { verifyOTP } from "@/actions/otp";
import QRCode from "./QRCode";

const initialState: ApiState<{
  otp?: string;
}> = {
  success: false,
  message: "",
  errors: {},
};

const VerifySuccess = () => {
  return (
    <div className="h-35 flex flex-col items-center justify-end">
      <svg
        className="w-10 h-10 text-green-500 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-xl text-gray-500 text-center">OTP 驗證成功 !</h3>
    </div>
  );
};

const VerifyForm = ({ onFinish, isInitialOTP }: { onFinish: () => void, isInitialOTP: boolean }) => {
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
      className="h-35 flex flex-col items-center justify-end"
    >
      <input
        type="text"
        placeholder="OTP"
        name="token"
        required
        autoComplete="one-time-code"
        inputMode="numeric"
        className="mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      />
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
    </form>
  );
};

const OtpVerify = ({
  dialogRef,
  otpUrl,
  onCancel,
  onFinish,
  isModal = true,
}: {
  dialogRef?: React.RefObject<HTMLDialogElement>;
  otpUrl?: string;
  onCancel?: () => void;
  onFinish?: () => void;
  isModal?: boolean;
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNextStep = () => {
    setIsVerifying(true);
  };

  const handleCancel = () => {
    setIsVerifying(false);
    if (onCancel) onCancel();
    if (dialogRef) dialogRef.current?.close();
  };

  const handleFinish = () => {
    setIsVerifying(false);
    if (onFinish) onFinish();
    if (dialogRef) dialogRef.current?.close();
  };

  const content = (() => {
    if (!otpUrl || isVerifying) {
      return <VerifyForm onFinish={handleFinish} isInitialOTP={!!otpUrl} />;
    }

    return (
      <div className="w-80 h-100 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 text-center">
          請使用 Google Authenticator 掃描 QR Code 或<br />
          手動輸入 OTP 密碼
        </p>
        {otpUrl ? (
          <QRCode data={otpUrl} />
        ) : (
          <p className="text-sm text-gray-500">正在生成 OTP...</p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
          onClick={handleNextStep}
        >
          下一步
        </button>
      </div>
    );
  })();

  if (isModal)
    return (
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black backdrop:opacity-50 backdrop:backdrop-blur-sm fixed inset-0 m-auto max-w-md max-h-fit rounded-lg shadow-lg border-0 p-0 bg-transparent"
      >
        <button onClick={handleCancel} className="absolute top-4 left-5">
          x
        </button>
        <div className="bg-white p-4 flex flex-col items-center justify-center rounded-lg">
          {content}
        </div>
      </dialog>
    );

  return <div className="flex items-center justify-center">{content}</div>;
};

export default OtpVerify;
