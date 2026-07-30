import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { updateDb } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const assessment = {
      userId: user.id,
      role: String(body.role || "Software Engineer"),
      focus: String(body.focus || "Cloud"),
      score: Number(body.score || 0),
      updatedAt: new Date().toISOString(),
    };

    await updateDb((db) => {
      const idx = db.assessments.findIndex((a) => a.userId === user.id);
      if (idx >= 0) db.assessments[idx] = assessment;
      else db.assessments.push(assessment);
      db.notifications.unshift({
        id: `n_${Date.now()}`,
        userId: user.id,
        title: "Skill gap updated",
        body: `Employability score ${assessment.score} for ${assessment.role}.`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    return NextResponse.json({ assessment });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
