import { OAuth2Client, CodeChallengeMethod, generateCodeVerifier, generateState, type OAuth2Tokens } from "arctic";

const AUTH_URL = "https://huggingface.co/oauth/authorize";
const TOKEN_URL = "https://huggingface.co/oauth/token";
const USERINFO_URL = "https://huggingface.co/oauth/userinfo";

function firstHeaderValue(value: string | null): string | null {
  return value?.split(",")[0]?.trim() || null;
}

function stripScheme(host: string | undefined): string | null {
  return host?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") || null;
}

function isLocalHost(host: string): boolean {
  return host.startsWith("localhost") || host.startsWith("127.") || host.startsWith("0.0.0.0") || host === "::1";
}

// Derive the public origin from the incoming request. HF Spaces serves at
// reubencf-praxaling.hf.space and our app sits behind their reverse proxy, so
// X-Forwarded-* headers carry the real host/scheme. NEXT_PUBLIC_APP_URL is
// unreliable on deploy targets (defaults to localhost in .env), so we never
// use it for the OAuth redirect URI — auth-request and token-exchange must
// use byte-identical redirect_uri values, and request-derived origin is the
// one thing both sides see consistently.
export function hfOriginFromRequest(req: Request): string {
  const forwardedHost = firstHeaderValue(req.headers.get("x-forwarded-host"));
  const forwardedProto = firstHeaderValue(req.headers.get("x-forwarded-proto"));
  const spaceHost = stripScheme(process.env.SPACE_HOST);
  const url = new URL(req.url);
  const requestHost = stripScheme(forwardedHost ?? req.headers.get("host") ?? url.host) ?? url.host;
  const host = spaceHost && isLocalHost(requestHost) ? spaceHost : requestHost;
  const proto = forwardedProto ?? (isLocalHost(host) ? "http" : "https");
  return `${proto}://${host}`;
}

export type HFUser = {
  sub: string;
  name?: string;
  preferred_username: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
};

function clientForRedirect(redirectUri: string) {
  const id = process.env.OAUTH_CLIENT_ID ?? process.env.HF_OAUTH_CLIENT_ID;
  const secret = process.env.OAUTH_CLIENT_SECRET ?? process.env.HF_OAUTH_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("HF_OAUTH_CLIENT_ID / HF_OAUTH_CLIENT_SECRET or OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET not set");
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
    "inference-api",
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
