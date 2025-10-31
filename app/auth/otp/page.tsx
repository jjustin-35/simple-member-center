"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OtpVerify from "@/components/Otp/OtpVerify";
import paths from "@/constants/paths";
import { createClient } from "@/utils/supabase/client";
import { registerOTP } from "@/actions/otp";

const OtpVerifyPage = () => {
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const [otpSecret, setOtpSecret] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.pathname);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      const confirm = window.confirm("Do you want to leave this page?");
      if (!confirm) {
        window.history.pushState(
          null,
          document.title,
          window.location.pathname
        );
        return;
      }
      supabase.auth.signOut();
      router.push(paths.login);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push(paths.login);
      }
    })();
  }, [supabase]);

  const onFinish = () => {
    router.push(paths.dashboard);
  };

  const onResetOTP = async () => {
    const result = await registerOTP();
    if (result.success) {
      setOtpUrl(result.data.otpauthURL);
      setOtpSecret(result.data.secret);
    }
  };
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <OtpVerify
        isModal={false}
        onFinish={onFinish}
        onResetOTP={onResetOTP}
        otpUrl={otpUrl}
        otpSecret={otpSecret}
      />
    </div>
  );
};

export default OtpVerifyPage;
