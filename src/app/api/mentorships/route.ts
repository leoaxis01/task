import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { uid, updateDb } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const mentorName = String(body.mentorName || "").trim();
    const focus = String(body.focus || "").trim();
    if (!mentorName) {
      return NextResponse.json({ error: "Mentor required" }, { status: 400 });
    }

    let mentorship = null as null | object;
    await updateDb((db) => {
      const existing = db.mentorships.find(
        (m) => m.userId === user.id && m.mentorName === mentorName
      );
      if (existing) {
        mentorship = existing;
        return;
      }
      const row = {
        id: uid("m"),
        userId: user.id,
        mentorName,
        focus,
        requestedAt: new Date().toISOString(),
        status: "pending" as const,
      };
      db.mentorships.unshift(row);
      db.notifications.unshift({
        id: uid("n"),
        userId: user.id,
        title: "Mentorship requested",
        body: `Waiting for match with ${mentorName}.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      mentorship = row;
    });

    return NextResponse.json({ mentorship });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
