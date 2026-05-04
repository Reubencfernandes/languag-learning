import { OAuth2Client, CodeChallengeMethod, generateCodeVerifier, generateState, type OAuth2Tokens } from "arctic";

const AUTH_URL = "https://huggingface.co/oauth/authorize";
const TOKEN_URL = "https://huggingface.co/oauth/token";
const USERINFO_URL = "https://huggingface.co/oauth/userinfo";

export type HFUser = {
  sub: string;
  name?: string;
  preferred_username: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
};

function clientForRedirect(redirectUri: string) {
  const id = process.env.HF_OAUTH_CLIENT_ID;
  const secret = process.env.HF_OAUTH_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("HF_OAUTH_CLIENT_ID / HF_OAUTH_CLIENT_SECRET not set");
  }
  return new OAuth2Client(id, secret, redirectUri);
}

export function hfBuildAuthUrl(redirectUri: string) {
  const client = clientForRedirect(redirectUri);
  const state = generateState();
  const verifier = generateCodeVerifier();
  const url = client.createAuthorizationURLWithPKCE(AUTH_URL, state, CodeChallengeMethod.S256, verifier, [
    "openid",
    "profile",
    "email",
  ]);
  return { url, state, verifier };
}

export async function hfExchangeCode(
  redirectUri: string,
  code: string,
  verifier: string,
): Promise<OAuth2Tokens> {
  const client = clientForRedirect(redirectUri);
  return client.validateAuthorizationCode(TOKEN_URL, code, verifier);
}

export async function hfFetchUser(accessToken: string): Promise<HFUser> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`HF userinfo failed: ${res.status}`);
  return (await res.json()) as HFUser;
}
