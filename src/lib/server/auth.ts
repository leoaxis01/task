import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { readDb, publicUser, type DbUser } from "@/lib/server/db";

const COOKIE = "task_session";
const secret = new TextEncoder().encode(
  process.env.TASK_AUTH_SECRET || "task-portal-dev-secret-change-me"
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUser(): Promise<ReturnType<typeof publicUser> | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = String(payload.sub || "");
    const db = await readDb();
    const user = db.users.find((u) => u.id === userId);
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<DbUser> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) throw new Error("UNAUTHORIZED");
  const { payload } = await jwtVerify(token, secret);
  const db = await readDb();
  const user = db.users.find((u) => u.id === String(payload.sub || ""));
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
