"use client";

import { useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import BackupInfo from "./BackupInfo";
import ModalWrapper from "../ModalWrapper";

const BackupSetting = ({ user }: { user: User }) => {
  const { backup_codes = [] } = user.user_metadata;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateBackupCode = () => {
    setIsRegenerating(true);
    dialogRef.current?.showModal();
  };

  const handleFinish = () => {
    dialogRef.current?.close();
  };

  if (!backup_codes?.length) return null;
  return (
    <div className="w-150 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">備份碼設定</h2>
      </div>

      <hr className="border-gray-200 my-4" />
      <div className="flex items-center mb-4 w-full justify-between border-2 border-gray-200 rounded-lg p-4">
        <p className="text-lg font-bold text-gray-500">備份碼</p>
        {/* <button
          className="px-4 py-2 bg-white border border-indigo-600 text-sm text-indigo-600 rounded-md"
          onClick={handleViewBackupCode}
        >
          檢視備份碼
        </button> */}
        <button
          className="px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
          onClick={handleRegenerateBackupCode}
        >
          重新生成
        </button>
      </div>
      <ModalWrapper dialogRef={dialogRef}>
        {isRegenerating ? <BackupInfo onFinish={handleFinish} /> : null}
      </ModalWrapper>
    </div>
  );
};

export default BackupSetting;
