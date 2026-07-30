import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server/auth";
import { readDb, uid, updateDb } from "@/lib/server/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ jobs: db.jobs });
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    // Employer posting a job
    if (body.action === "post") {
      if (user.role !== "Employer" && user.role !== "Government Admin") {
        return NextResponse.json({ error: "Employer role required" }, { status: 403 });
      }
      const job = {
        id: uid("job"),
        title: String(body.title || "").trim(),
        company: String(body.company || user.company || user.name),
        location: String(body.location || "Hyderabad"),
        type: String(body.type || "Full-time"),
        skills: String(body.skills || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        match: 70,
        description: String(body.description || ""),
        employerId: user.id,
        createdAt: new Date().toISOString(),
      };
      if (!job.title) {
        return NextResponse.json({ error: "Title required" }, { status: 400 });
      }
      await updateDb((db) => {
        db.jobs.unshift(job);
        db.notifications.unshift({
          id: uid("n"),
          userId: user.id,
          title: "Job posted",
          body: `${job.title} is live on Digital Job Centres.`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      });
      return NextResponse.json({ job });
    }

    // Student applying
    const jobId = String(body.jobId || "");
    const db = await readDb();
    const job = db.jobs.find((j) => j.id === jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let application = null as null | object;
    await updateDb((d) => {
      const existing = d.applications.find(
        (a) => a.userId === user.id && a.jobId === job.id
      );
      if (existing) {
        application = existing;
        return;
      }
      const row = {
        id: uid("j"),
        userId: user.id,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: new Date().toISOString(),
        status: "submitted" as const,
      };
      d.applications.unshift(row);
      d.notifications.unshift({
        id: uid("n"),
        userId: user.id,
        title: "Application submitted",
        body: `${job.title} at ${job.company}`,
        createdAt: new Date().toISOString(),
        read: false,
      });
      if (job.employerId) {
        d.notifications.unshift({
          id: uid("n"),
          userId: job.employerId,
          title: "New applicant",
          body: `${user.name} applied for ${job.title}`,
          createdAt: new Date().toISOString(),
          read: false,
        });
      }
      application = row;
    });

    return NextResponse.json({ application });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
