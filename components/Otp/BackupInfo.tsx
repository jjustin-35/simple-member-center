import { useState, useEffect, useTransition } from "react";
import { generateBackupCode, saveBackupCode } from "@/actions/backup";

const BackupInfo = ({ onFinish }: { onFinish: () => void }) => {
  const [isPending, startTransition] = useTransition();
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
      startTransition(() => {
        setCodes(codes);
      });
    })();
  }, []);

  const onCopyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    alert("複製成功");
  };

  if (isPending)
    return (
      <div className="w-80 h-100 flex items-center justify-center">
        Loading...
      </div>
    );
  if (!codes.length) return null;
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex justify-between items-center w-full mb-4">
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
