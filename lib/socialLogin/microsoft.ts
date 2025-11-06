import {
  Configuration,
  createStandardPublicClientApplication,
  IPublicClientApplication,
} from "@azure/msal-browser";
import { generateNonce, socialLogin } from "@/actions/socialLogin";

let pca: IPublicClientApplication | null = null;

const initMicrosoftSDK = async () => {
  const msalConfig: Configuration = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
      authority: `https://login.microsoftonline.com/common`,
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

    const {plainNonce, encodedNonce} = await generateNonce();
    const result = await pca.loginPopup({
      scopes: ["user.read"],
      redirectUri: `/auth/microsoft/callback`,
      nonce: encodedNonce,
    });
    const { accessToken, idToken } = result;

    if (!accessToken || !idToken) {
      throw new Error("no access token or id token");
    }

    const resp = await socialLogin("azure", idToken, plainNonce);
    if (!resp.success) {
      throw new Error(resp.error?.message || "Social login failed");
    }

    return resp;
  } catch (error) {
    console.error("Microsoft login failed:", error);
    return { success: false, message: "Microsoft login failed", error: error as Error };
  }
};
