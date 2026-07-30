import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null });

  const db = await readDb();
  const enrollments = db.enrollments.filter((e) => e.userId === user.id);
  const applications = db.applications.filter((a) => a.userId === user.id);
  const mentorships = db.mentorships.filter((m) => m.userId === user.id);
  const notifications = db.notifications.filter((n) => n.userId === user.id);
  const resume =
    db.resumes.find((r) => r.userId === user.id) || {
      headline: "",
      summary: "",
      skills: [] as string[],
      education: "",
      projects: "",
    };
  const assessment = db.assessments.find((a) => a.userId === user.id) || null;
  const ventures = db.ventures.filter((v) => v.userId === user.id);
  const employerJobIds = new Set(
    db.jobs.filter((j) => j.employerId === user.id).map((j) => j.id)
  );
  const employerApplicants =
    user.role === "Employer" || user.role === "Government Admin"
      ? db.applications.filter((a) => a.jobId && employerJobIds.has(a.jobId))
      : [];

  return NextResponse.json({
    user,
    enrollments,
    applications:
      user.role === "Employer" || user.role === "Government Admin"
        ? [...applications, ...employerApplicants.filter((a) => a.userId !== user.id)]
        : applications,
    mentorships,
    notifications,
    resume,
    assessment,
    ventures,
    jobs: db.jobs,
  });
}
