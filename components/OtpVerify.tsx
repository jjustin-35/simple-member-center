"use client";

import {
  useActionState,
  startTransition,
  useRef,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
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

const VerifyForm = ({ onClose }: { onClose: () => void }) => {
  const [state, formAction, isPending] = useActionState(
    verifyOTP,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      if (onClose) onClose();
      router.push("/dashboard");
    }
  }, [state.success]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center"
    >
      <input type="text" placeholder="OTP" />
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
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  otpUrl: string;
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNextStep = () => {
    setIsVerifying(true);
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const content = (() => {
    if (isVerifying) {
      return <VerifyForm onClose={handleClose} />;
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

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black backdrop:opacity-50 backdrop:backdrop-blur-sm fixed inset-0 m-auto max-w-md max-h-fit rounded-lg shadow-lg border-0 p-0 bg-transparent"
    >
      <button onClick={handleClose} className="absolute top-4 left-5">
        x
      </button>
      <div className="bg-white p-4 flex flex-col items-center justify-center rounded-lg">
        {content}
      </div>
    </dialog>
  );
};

export default OtpVerify;
