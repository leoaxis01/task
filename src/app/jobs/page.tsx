"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { usePortal } from "@/lib/portal-store";

const features = [
  "AI-powered job matching",
  "Internship marketplace",
  "Campus hiring platform",
  "Employer dashboards",
  "Virtual job fairs",
  "Resume builder",
  "Applicant tracking (ATS)",
  "Government scheme integration",
  "Gig & freelance opportunities",
];

export default function JobsPage() {
  const router = useRouter();
  const { user, jobs, applications, applyJob } = usePortal();
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const [flash, setFlash] = useState("");
  const [busy, setBusy] = useState("");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const hay = `${job.title} ${job.company} ${job.location} ${job.skills.join(" ")}`.toLowerCase();
      const matchesType = type === "All" || job.type === type;
      const matchesQuery = !query || hay.includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [jobs, type, query]);

  async function onApply(jobId: string, title: string) {
    if (!user) {
      router.push("/login?next=/jobs");
      return;
    }
    setBusy(jobId);
    try {
      await applyJob(jobId);
      setFlash(`Applied: ${title}`);
      setTimeout(() => setFlash(""), 2500);
    } finally {
      setBusy("");
    }
  }

  function applied(jobId: string, title: string, company: string) {
    return applications.some(
      (a) => a.jobId === jobId || (a.jobTitle === title && a.company === company)
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Module 5.2 · Telangana Digital Job Centres"
        title="Integrated employment exchange for youth & employers"
        description="Server-backed job matching across IT, manufacturing, pharma, startups, and MSMEs — apply once and track on your dashboard."
        primaryHref="/resume"
        primaryLabel="Build resume"
        secondaryHref="/job-fair"
        secondaryLabel="Open virtual job fair"
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span
                  key={f}
                  className="border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink/70"
                >
                  {f}
                </span>
              ))}
            </div>
          </FadeIn>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles, companies, skills..."
              className="border border-line bg-white px-3 py-2 text-sm"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-line bg-white px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Full-time</option>
              <option>Internship</option>
              <option>Trainee</option>
              <option>Campus</option>
            </select>
          </div>

          {flash ? (
            <p className="mt-3 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
              {flash} ·{" "}
              <Link href="/dashboard" className="font-semibold underline">
                View dashboard
              </Link>
            </p>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {filtered.map((job, i) => {
              const done = applied(job.id, job.title, job.company);
              return (
                <FadeIn key={job.id} delay={i * 0.03}>
                  <article className="border border-line bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl sm:text-2xl">
                          {job.title}
                        </h2>
                        <p className="mt-1 text-sm text-ink/65">
                          {job.company} · {job.location}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-brand-soft px-2 py-1 text-xs font-semibold text-brand-deep">
                        {job.match ?? 70}% match
                      </span>
                    </div>
                    {job.description ? (
                      <p className="mt-3 text-sm text-ink/65">{job.description}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                        {job.type}
                      </span>
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="border border-line px-2 py-0.5 text-xs text-ink/65"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        disabled={done || busy === job.id}
                        onClick={() => onApply(job.id, job.title)}
                        className={done ? "btn bg-brand-soft text-brand-deep" : "btn-primary"}
                      >
                        {done ? "Applied" : busy === job.id ? "Applying..." : "Apply now"}
                      </button>
                      <Link href="/skill-gap" className="btn-secondary">
                        Improve match
                      </Link>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
