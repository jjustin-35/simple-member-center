"use client";

import { signout } from "@/actions/signout";

export default function SignoutButton() {
  const onSignout = async () => {
    await signout();
  };

  return (
    <button
      className="mb-10 px-4 py-2 bg-red-600 hover:bg-red-700 text-sm text-white rounded-md"
      onClick={onSignout}
    >
      登出
    </button>
  );
}
