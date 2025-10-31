"use client";

import { useState, useRef, useTransition } from "react";
import { User } from "@supabase/supabase-js";

const OtpForm = ({ user }: { user: User }) => {
  const { backup_codes } = user.user_metadata;
  const [isPending, startTransition] = useTransition();
  const [isRegistered, setIsRegistered] = useState(!!backup_codes);


  return (
    <div className="w-150 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">備份碼設定</h2>
        {!isRegistered && (
          <button
            className="px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
            onClick={() => {}}
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
            onClick={() => {}}
          >
            刪除
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpForm;
