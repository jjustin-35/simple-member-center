"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OtpVerify from "@/components/OtpVerify";
import paths from "@/constants/paths";
import { createClient } from "@/utils/supabase/client";

const OtpVerifyPage = () => {
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
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <OtpVerify isModal={false} onFinish={onFinish} />
    </div>
  );
};

export default OtpVerifyPage;
