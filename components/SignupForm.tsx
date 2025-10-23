"use client";

import { useActionState, startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/actions/signup";
import { ApiState } from "@/types/api";

type SignupFormState = ApiState<{
  email?: string;
  password?: string;
}>;

const initialState: SignupFormState = {
  success: false,
  message: "",
  errors: {},
};

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/login");
    }
  }, [state.success]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => formAction(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            建立新帳戶
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            請填寫以下資訊來建立您的帳戶
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  state.errors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="請輸入電子郵件"
              />
              {state.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  state.errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="請輸入密碼 (至少6個字元)"
              />
              {state.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gray-900"
            >
              我同意
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                服務條款
              </a>
              和
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                隱私政策
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  註冊中...
                </div>
              ) : (
                "建立帳戶"
              )}
            </button>
          </div>

          {/* Success/Error Message */}
          {state.message && (
            <div
              className={`text-center text-sm ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              已經有帳戶？
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                立即登入
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
