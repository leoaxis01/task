"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";
import { PageHero } from "@/components/PageHero";
import { usePortal } from "@/lib/portal-store";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    hydrated,
    enrollments,
    applications,
    mentorships,
    assessment,
    resume,
    notifications,
  } = usePortal();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/dashboard");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="container-page py-20 text-sm text-ink/60">
        Loading your TASK workspace...
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="My Dashboard"
        title={`Welcome, ${user.name}`}
        description={`${user.role} · ${user.stream} · ${user.district}. Track enrollments, applications, mentorship, and your employability score in one place.`}
        primaryHref="/courses/engineering"
        primaryLabel="Enrol in a course"
        secondaryHref="/jobs"
        secondaryLabel="Browse jobs"
      />

      <section className="section-pad">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Courses enrolled", value: enrollments.length, href: "/learning" },
            { label: "Job applications", value: applications.length, href: "/jobs" },
            { label: "Mentorship requests", value: mentorships.length, href: "/mentorship" },
            {
              label: "Employability score",
              value: assessment?.score ?? "—",
              href: "/skill-gap",
            },
          ].map((stat) => (
            <FadeIn key={stat.label}>
              <Link
                href={stat.href}
                className="block border border-line bg-white p-5 transition hover:border-brand/40"
              >
                <p className="stat-num">{stat.value}</p>
                <p className="mt-1 text-sm text-ink/65">{stat.label}</p>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="container-page mt-10 grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">My courses</h2>
                <Link href="/courses/engineering" className="text-sm font-semibold text-brand">
                  Add more
                </Link>
              </div>
              {enrollments.length === 0 ? (
                <p className="mt-4 text-sm text-ink/60">
                  No enrollments yet. Open the engineering catalogue and click Enrol.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {enrollments.map((e) => (
                    <li key={e.id} className="border border-line bg-mist px-3 py-2 text-sm">
                      <p className="font-medium">
                        {e.technology} — {e.module}
                      </p>
                      <p className="text-ink/55">
                        {e.status} · {new Date(e.enrolledAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Applications</h2>
                <Link href="/jobs" className="text-sm font-semibold text-brand">
                  Job centres
                </Link>
              </div>
              {applications.length === 0 ? (
                <p className="mt-4 text-sm text-ink/60">
                  No applications yet. Apply from Digital Job Centres.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {applications.map((a) => (
                    <li key={a.id} className="border border-line bg-mist px-3 py-2 text-sm">
                      <p className="font-medium">{a.jobTitle}</p>
                      <p className="text-ink/55">
                        {a.company} · {a.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Mentorship</h2>
                <Link href="/mentorship" className="text-sm font-semibold text-brand">
                  Find mentors
                </Link>
              </div>
              {mentorships.length === 0 ? (
                <p className="mt-4 text-sm text-ink/60">
                  Request a mentor match to get career guidance sessions.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {mentorships.map((m) => (
                    <li key={m.id} className="border border-line bg-mist px-3 py-2 text-sm">
                      <p className="font-medium">{m.mentorName}</p>
                      <p className="text-ink/55">
                        {m.focus} · {m.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Profile toolkit</h2>
                <Link href="/resume" className="text-sm font-semibold text-brand">
                  Resume builder
                </Link>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                <li>
                  Email: <span className="font-medium text-ink">{user.email}</span>
                </li>
                <li>
                  District: <span className="font-medium text-ink">{user.district}</span>
                </li>
                <li>
                  Resume headline:{" "}
                  <span className="font-medium text-ink">
                    {resume.headline || "Not set"}
                  </span>
                </li>
                <li>
                  Latest alerts: {notifications.filter((n) => !n.read).length} unread
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/skill-gap" className="btn-secondary">
                  Update skill score
                </Link>
                <Link href="/entrepreneurship" className="btn-secondary">
                  Startup track
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
