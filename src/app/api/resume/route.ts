import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { updateDb } from "@/lib/server/db";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const resume = {
      userId: user.id,
      headline: String(body.headline || ""),
      summary: String(body.summary || ""),
      skills: Array.isArray(body.skills)
        ? body.skills.map(String)
        : String(body.skills || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      education: String(body.education || ""),
      projects: String(body.projects || ""),
      updatedAt: new Date().toISOString(),
    };

    await updateDb((db) => {
      const idx = db.resumes.findIndex((r) => r.userId === user.id);
      if (idx >= 0) db.resumes[idx] = resume;
      else db.resumes.push(resume);
      db.notifications.unshift({
        id: `n_${Date.now()}`,
        userId: user.id,
        title: "Resume saved",
        body: "Your TASK resume draft is updated on the server.",
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    return NextResponse.json({ resume });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
