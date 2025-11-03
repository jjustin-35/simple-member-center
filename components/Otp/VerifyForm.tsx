"use client";

import { useActionState, startTransition, useEffect, useState } from "react";
import { ApiState } from "@/types/api";
import { verifyOTP } from "@/actions/otp";
import VerifySuccess from "./VerifySuccess";
import BackupInfo from "../Backup/BackupInfo";

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
  const [isShowingBackupInfo, setIsShowingBackupInfo] = useState(false);
  const [state, formAction, isPending] = useActionState(
    (_: ApiState, formData: FormData) => verifyOTP(_, formData, isInitialOTP),
    initialState
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isInitialOTP && state.success) {
      setIsShowingBackupInfo(true);
      return;
    }

    if (state.success) {
      timeout = setTimeout(() => {
        if (onFinish) onFinish();
      }, 1000);
    }

    return () => timeout && clearTimeout(timeout);
  }, [state.success, isInitialOTP]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  };

  if (isShowingBackupInfo) return <BackupInfo onFinish={onFinish} />;
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
      <input
        type="checkbox"
        name="isTrustDevice"
        id="isTrustDevice"
        value="true"
      />
      <label htmlFor="isTrustDevice">
        信任此裝置，下次登入時不需要驗證 OTP
      </label>
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
      {!isInitialOTP && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          無法成功驗證?
          <a
            className="text-indigo-600 cursor-pointer underline"
            onClick={onVerifyBackupCode}
          >
            使用備份碼驗證
          </a>
        </div>
      )}
    </form>
  );
};

export default VerifyForm;
