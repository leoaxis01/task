import { NextResponse } from "next/server";
import { readDb } from "@/lib/server/db";
import { districtHeat } from "@/data/portal";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({
    totals: {
      students: db.users.filter((u) => u.role === "Student").length,
      employers: db.users.filter((u) => u.role === "Employer").length,
      mentors: db.users.filter((u) => u.role === "Mentor").length,
      enrollments: db.enrollments.length,
      applications: db.applications.length,
      mentorships: db.mentorships.length,
      openJobs: db.jobs.length,
      ventures: db.ventures.length,
    },
    districts: districtHeat,
    recentApplications: db.applications.slice(0, 8),
    recentEnrollments: db.enrollments.slice(0, 8),
  });
}
