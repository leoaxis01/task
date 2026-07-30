import { NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "@/lib/server/auth";
import { publicUser, readDb, uid, updateDb, type UserRole } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = body.role as UserRole | undefined;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = await readDb();
    const user = db.users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (role && role !== user.role) {
      await updateDb((d) => {
        const u = d.users.find((x) => x.id === user.id);
        if (u) u.role = role;
      });
    }

    await updateDb((d) => {
      d.notifications.unshift({
        id: uid("n"),
        userId: user.id,
        title: "Signed in",
        body: `Session active as ${role || user.role}.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    const token = await createSessionToken(user.id);
    await setSessionCookie(token);
    const fresh = await readDb();
    const current = fresh.users.find((u) => u.id === user.id)!;
    return NextResponse.json({ user: publicUser(current) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Login failed" },
      { status: 500 }
    );
  }
}
