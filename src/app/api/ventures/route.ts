import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { uid, updateDb } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const venture = {
      id: uid("v"),
      userId: user.id,
      program: String(body.program || ""),
      title: String(body.title || "").trim(),
      submittedAt: new Date().toISOString(),
    };
    if (!venture.title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    await updateDb((db) => {
      db.ventures.unshift(venture);
      db.notifications.unshift({
        id: uid("n"),
        userId: user.id,
        title: "Startup submission received",
        body: `${venture.title} added to ${venture.program}.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });
    return NextResponse.json({ venture });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
