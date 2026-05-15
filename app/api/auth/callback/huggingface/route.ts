import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hfExchangeCode, hfFetchUser, hfOriginFromRequest } from "@/lib/auth/hf";
import { SESSION_COOKIE, signSession, SESSION_MAX_AGE } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const clientFlag = url.searchParams.get("client");

  const cookieJar = await cookies();
  const storedState = cookieJar.get("hf_oauth_state")?.value;
  const verifier = cookieJar.get("hf_oauth_verifier")?.value;
  const clientKind = clientFlag === "mobile" ? "mobile" : cookieJar.get("hf_oauth_client")?.value ?? "web";

  cookieJar.delete("hf_oauth_state");
  cookieJar.delete("hf_oauth_verifier");
  cookieJar.delete("hf_oauth_client");

  if (!code || !state || !verifier || state !== storedState) {
    return NextResponse.json({ error: "invalid_state" }, { status: 400 });
  }

  const origin = hfOriginFromRequest(req);
  const redirectUri =
    clientKind === "mobile"
      ? `${origin}/api/auth/callback/huggingface?client=mobile`
      : `${origin}/api/auth/callback/huggingface`;

  let tokens;
  try {
    tokens = await hfExchangeCode(redirectUri, code, verifier);
  } catch (err) {
    console.error("hf token exchange failed", err);
    return NextResponse.json({ error: "token_exchange_failed" }, { status: 400 });
  }

  const accessToken = tokens.accessToken();
  const hfUser = await hfFetchUser(accessToken);

  const jwt = await signSession({
    hfId: hfUser.sub,
    hfUsername: hfUser.preferred_username,
    email: hfUser.email,
    avatarUrl: hfUser.picture,
    accessToken,
  });

  if (clientKind === "mobile") {
    return NextResponse.redirect(`langlearn://auth/callback?token=${encodeURIComponent(jwt)}`);
  }

  const isProd = process.env.NODE_ENV === "production";
  const res = NextResponse.redirect(`${origin}/practice`);
  // SameSite=None in prod so the session cookie is sent when the Space is
  // iframed inside huggingface.co/spaces/... (third-party context). Requires
  // Secure, which Spaces serve under.
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

