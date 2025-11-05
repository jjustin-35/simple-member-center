import { useState, useEffect } from "react";
import { generateBackupCode, saveBackupCode } from "@/actions/backup";

const BackupInfo = ({ onFinish }: { onFinish: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<string[]>([]);
  const amount = 5;

  useEffect(() => {
    (async () => {
      const codes = await Promise.all(
        Array(amount)
          .fill(null)
          .map(async () => await generateBackupCode())
      );
      const result = await saveBackupCode(codes);
      if (!result.success) {
        console.error(result.message);
        return;
      }
      setCodes(codes);
      setIsLoading(false);
    })();

    return () => {
      setIsLoading(true);
      setCodes([]);
    };
  }, []);

  const onCopyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    alert("複製成功");
  };

  if (isLoading)
    return (
      <div className="w-80 h-100 flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
          xmlns="http://www.w3.org/2000/2000/svg"
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
        載入中...
      </div>
    );
  if (!codes.length)
    return (
      <div className="w-80 h-100 flex items-center justify-center">
        <p className="text-sm text-gray-500 text-center">載入備份碼失敗</p>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex justify-between items-center gap-2 w-full mb-4">
        <p className="text-sm text-gray-500 text-center">
          請將以下備份碼保存到安全的地方
        </p>
        <button
          className="px-4 py-2 bg-white border border-indigo-600 text-xs text-indigo-600 rounded-md"
          onClick={onCopyAll}
        >
          複製全部
        </button>
      </div>
      <ul className="list-disc list-inside">
        {codes.map((code) => (
          <li className="text-sm text-gray-500" key={code}>
            {code}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-sm text-white rounded-md"
        onClick={onFinish}
      >
        完成
      </button>
    </div>
  );
};

export default BackupInfo;
