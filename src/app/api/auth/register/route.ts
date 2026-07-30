import { NextResponse } from "next/server";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
} from "@/lib/server/auth";
import { publicUser, readDb, uid, updateDb, type UserRole } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "task2026");
    const mobile = String(body.mobile || "").trim();
    const role = (body.role || "Student") as UserRole;
    const district = String(body.district || "Hyderabad");
    const stream = String(body.stream || "Engineering");
    const college = String(body.college || "TASK Registered College");
    const company = String(body.company || "");

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await readDb();
    if (existing.users.some((u) => u.email === email)) {
      return NextResponse.json({ error: "Account already exists. Please sign in." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const id = uid("u");
    await updateDb((db) => {
      db.users.push({
        id,
        name,
        email,
        passwordHash,
        mobile,
        role,
        district,
        stream,
        college,
        company: company || undefined,
        createdAt: new Date().toISOString(),
      });
      db.notifications.unshift({
        id: uid("n"),
        userId: id,
        title: "Welcome to TASK 2.0",
        body: `Your ${role.toLowerCase()} account is active across skill, mentorship, and employment modules.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    const token = await createSessionToken(id);
    await setSessionCookie(token);
    const db = await readDb();
    const user = db.users.find((u) => u.id === id)!;
    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Registration failed" },
      { status: 500 }
    );
  }
}
