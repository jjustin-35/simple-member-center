import {
  Configuration,
  createStandardPublicClientApplication,
  IPublicClientApplication,
} from "@azure/msal-browser";
import { socialLogin } from "@/actions/socialLogin";

let pca: IPublicClientApplication | null = null;

const initMicrosoftSDK = async () => {
  const msalConfig: Configuration = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MICROSOFT_TENENT_ID}`,
    },
  };
  const pca = await createStandardPublicClientApplication(msalConfig);
  await pca.initialize();

  return pca;
};

export const microsoftLogin = async () => {
  try {
    if (!pca) {
      pca = await initMicrosoftSDK();
    }

    const result = await pca.loginPopup({
      scopes: ["user.read"],
      redirectUri: `/auth/microsoft/callback`,
    });
    const { accessToken, idToken } = result;

    console.log("accessToken", accessToken);
    console.log("idToken", idToken);

    if (!accessToken || !idToken) {
      throw new Error("no access token or id token");
    }

    const resp = await socialLogin("azure", idToken);
    if (!resp.success) {
      throw new Error(resp.error?.message || "Social login failed");
    }

    return resp;
  } catch (error) {
    console.error("Microsoft login failed:", error);
    return { success: false, message: "Microsoft login failed", error: error as Error };
  }
};
