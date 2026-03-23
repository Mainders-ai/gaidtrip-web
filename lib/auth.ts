import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "gaidtrip-admin-secret-change-me"
);

const COOKIE_NAME = "gaid_admin_session";

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export async function getSessionFromCookies(): Promise<string | undefined> {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}
