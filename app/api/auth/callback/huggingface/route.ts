import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hfExchangeCode, hfFetchUser } from "@/lib/auth/hf";
import { SESSION_COOKIE, signSession, SESSION_MAX_AGE } from "@/lib/auth/session";

const BASE = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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

  const redirectUri =
    clientKind === "mobile"
      ? `${BASE()}/api/auth/callback/huggingface?client=mobile`
      : `${BASE()}/api/auth/callback/huggingface`;

  let tokens;
  try {
    tokens = await hfExchangeCode(redirectUri, code, verifier);
  } catch (err) {
    console.error("hf token exchange failed", err);
    return NextResponse.json({ error: "token_exchange_failed" }, { status: 400 });
  }

  const accessToken = tokens.accessToken();
  const hfUser = await hfFetchUser(accessToken);

  const [existing] = await db.select().from(users).where(eq(users.hfId, hfUser.sub)).limit(1);
  const user = existing
    ? existing
    : (
        await db
          .insert(users)
          .values({
            hfId: hfUser.sub,
            hfUsername: hfUser.preferred_username,
            email: hfUser.email,
            avatarUrl: hfUser.picture,
          })
          .returning()
      )[0];

  const jwt = await signSession({ userId: user.id, hfUsername: user.hfUsername });

  if (clientKind === "mobile") {
    return NextResponse.redirect(`langlearn://auth/callback?token=${encodeURIComponent(jwt)}`);
  }

  const res = NextResponse.redirect(`${BASE()}/practice`);
  res.cookies.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
