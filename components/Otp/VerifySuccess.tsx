const VerifySuccess = () => {
  return (
    <div className="h-35 flex flex-col items-center justify-center">
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

export default VerifySuccess;