import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { updateDb } from "@/lib/server/db";

export async function POST() {
  try {
    const user = await requireUser();
    await updateDb((db) => {
      db.notifications = db.notifications.map((n) =>
        n.userId === user.id ? { ...n, read: true } : n
      );
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
