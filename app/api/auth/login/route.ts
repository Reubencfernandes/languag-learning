import { NextResponse } from "next/server";
import { hfBuildAuthUrl } from "@/lib/auth/hf";

const WEB_REDIRECT = () => `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/auth/callback/huggingface`;
const MOBILE_REDIRECT = () => `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/auth/callback/huggingface?client=mobile`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const client = url.searchParams.get("client") === "mobile" ? "mobile" : "web";

  const redirectUri = client === "mobile" ? MOBILE_REDIRECT() : WEB_REDIRECT();
  const { url: authUrl, state, verifier } = hfBuildAuthUrl(redirectUri);

  const res = NextResponse.redirect(authUrl.toString());
  // SameSite=None so the cookies come back when HF redirects to the callback
  // from a third-party context (e.g. our app is iframed inside huggingface.co/spaces/...).
  // Requires Secure, which HF Spaces always serves under.
  const isProd = process.env.NODE_ENV === "production";
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 60 * 10,
  };
  res.cookies.set("hf_oauth_state", state, cookieOpts);
  res.cookies.set("hf_oauth_verifier", verifier, cookieOpts);
  res.cookies.set("hf_oauth_client", client, cookieOpts);

  return res;
}
