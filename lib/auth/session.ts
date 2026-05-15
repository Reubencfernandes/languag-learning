import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

export const SESSION_COOKIE = "ll_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export type SessionPayload = {
  hfId: string;
  hfUsername: string;
  email?: string;
  avatarUrl?: string;
  nativeLang?: string;
  targetLang?: string;
  targetLangs?: string[];
  level?: string;
  accessToken?: string;
  streakCount?: number;
  lastActiveDate?: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secret(), { algorithms: ["HS256"] });
    if (!payload.hfId) return null;
    return {
      hfId: payload.hfId,
      hfUsername: payload.hfUsername,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
      nativeLang: payload.nativeLang,
      targetLang: payload.targetLang,
      targetLangs: payload.targetLangs,
      level: payload.level,
      accessToken: payload.accessToken,
      streakCount: payload.streakCount,
      lastActiveDate: payload.lastActiveDate,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const authHeader = (await headers()).get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return verifySession(token);
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

