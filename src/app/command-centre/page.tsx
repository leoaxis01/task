"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { commandStats, districtHeat } from "@/data/portal";
import { usePortal } from "@/lib/portal-store";

const dashboards = [
  "District-wise employment statistics",
  "Placement analytics",
  "Institution performance",
  "Mentor engagement metrics",
  "Industry participation",
  "Training completion rates",
  "Skill demand forecasting",
  "Gender and rural participation tracking",
];

type LiveStats = {
  totals: {
    students: number;
    employers: number;
    mentors: number;
    enrollments: number;
    applications: number;
    mentorships: number;
    openJobs: number;
    ventures: number;
  };
};

export default function CommandCentrePage() {
  const { user, enrollments, applications, mentorships } = usePortal();
  const [district, setDistrict] = useState("All districts");
  const [live, setLive] = useState<LiveStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setLive)
      .catch(() => undefined);
  }, [enrollments.length, applications.length, mentorships.length]);

  const filtered = useMemo(() => {
    if (district === "All districts") return districtHeat;
    return districtHeat.filter((d) => d.district === district);
  }, [district]);

  const sessionStats = [
    { label: "Portal enrollments (you)", value: String(enrollments.length) },
    { label: "Applications (you)", value: String(applications.length) },
    { label: "Mentorship (you)", value: String(mentorships.length) },
    { label: "Signed-in role", value: user?.role ?? "Guest" },
  ];

  const systemStats = live
    ? [
        { label: "Students on platform", value: String(live.totals.students) },
        { label: "Open jobs", value: String(live.totals.openJobs) },
        { label: "Total enrollments", value: String(live.totals.enrollments) },
        { label: "Applications filed", value: String(live.totals.applications) },
        { label: "Mentorship requests", value: String(live.totals.mentorships) },
        { label: "Ventures submitted", value: String(live.totals.ventures) },
      ]
    : commandStats.map((s) => ({ label: s.label, value: s.value }));

  return (
    <>
      <PageHero
        eyebrow="Module 5.4 · Command & Control Centre"
        title="Centralized governance and monitoring for TASK 2.0"
        description="Live platform counters from the TASK API plus district placement intelligence for policy monitoring."
        primaryHref="/skill-gap"
        primaryLabel="Open skill intelligence"
        secondaryHref="/jobs"
        secondaryLabel="View job centre activity"
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {systemStats.map((stat) => (
                <div key={stat.label} className="border border-line bg-white p-5">
                  <p className="stat-num">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink/65">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sessionStats.map((stat) => (
                <div key={stat.label} className="border border-line bg-sand p-4">
                  <p className="font-display text-2xl text-brand-deep">{stat.value}</p>
                  <p className="mt-1 text-xs text-ink/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <FadeIn>
              <div className="border border-line bg-white p-6">
                <h2 className="font-display text-2xl">Dashboard coverage</h2>
                <ul className="mt-4 space-y-2">
                  {dashboards.map((item) => (
                    <li
                      key={item}
                      className="border-b border-ink/10 py-2 text-sm text-ink/75 last:border-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="btn-secondary mt-6">
                  Open personal dashboard
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="border border-line bg-brand-deep p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-2xl text-accent">
                    Placement pulse by district
                  </h2>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="border border-white/20 bg-brand px-2 py-1 text-sm text-white"
                  >
                    <option>All districts</option>
                    {districtHeat.map((d) => (
                      <option key={d.district}>{d.district}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 space-y-4">
                  {filtered.map((d) => {
                    const conversion = Math.round((d.supply / d.demand) * 100);
                    return (
                      <div key={d.district}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{d.district}</span>
                          <span className="text-accent">{conversion}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/15">
                          <div
                            className="h-2 rounded-full bg-accent"
                            style={{ width: `${Math.min(100, conversion)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
