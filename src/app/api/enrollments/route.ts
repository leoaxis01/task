import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { uid, updateDb } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const technology = String(body.technology || "").trim();
    const module = String(body.module || "").trim();
    if (!technology || !module) {
      return NextResponse.json({ error: "Course required" }, { status: 400 });
    }
    const courseKey = `${technology}::${module}`;
    let enrollment = null as null | object;

    await updateDb((db) => {
      const existing = db.enrollments.find(
        (e) => e.userId === user.id && e.courseKey === courseKey
      );
      if (existing) {
        enrollment = existing;
        return;
      }
      const row = {
        id: uid("e"),
        userId: user.id,
        courseKey,
        technology,
        module,
        enrolledAt: new Date().toISOString(),
        status: "enrolled" as const,
      };
      db.enrollments.unshift(row);
      db.notifications.unshift({
        id: uid("n"),
        userId: user.id,
        title: "Course enrolled",
        body: `${technology} — ${module} added to your Learning Hub.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      enrollment = row;
    });

    return NextResponse.json({ enrollment });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
