"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { usePortal } from "@/lib/portal-store";

export default function ResumePage() {
  const router = useRouter();
  const { user, resume, saveResume } = usePortal();
  const [headline, setHeadline] = useState(resume.headline);
  const [summary, setSummary] = useState(resume.summary);
  const [skills, setSkills] = useState(resume.skills.join(", "));
  const [education, setEducation] = useState(resume.education);
  const [projects, setProjects] = useState(resume.projects);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login?next=/resume");
      return;
    }
    void saveResume({
      headline,
      summary,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      education,
      projects,
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    });
  }

  return (
    <>
      <PageHero
        eyebrow="Digital Job Centres toolkit"
        title="TASK resume builder"
        description="Create a video-ready profile draft with headline, skills, education, and projects. Saved locally to your TASK session."
        primaryHref="/jobs"
        primaryLabel="Apply with resume"
        secondaryHref="/dashboard"
        secondaryLabel="Back to dashboard"
      />
      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSubmit} className="border border-line bg-white p-6">
            <label className="block text-sm font-medium">
              Headline
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                placeholder="CSE student | Java & Cloud aspiring engineer"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Summary
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-1 min-h-28 w-full border border-line bg-mist px-3 py-2"
                placeholder="Brief career summary..."
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Skills (comma separated)
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                placeholder="Java, SQL, Communication"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Education
              <textarea
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="mt-1 min-h-20 w-full border border-line bg-mist px-3 py-2"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Projects
              <textarea
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                className="mt-1 min-h-20 w-full border border-line bg-mist px-3 py-2"
                required
              />
            </label>
            <button type="submit" className="btn-primary mt-6">
              Save resume draft
            </button>
            {saved ? (
              <p className="mt-3 text-sm text-brand">
                Resume saved.{" "}
                <Link href="/jobs" className="font-semibold underline">
                  Continue to jobs
                </Link>
              </p>
            ) : null}
          </form>

          <div className="border border-line bg-sand p-6">
            <p className="eyebrow">Live preview</p>
            <h2 className="mt-3 font-display text-2xl">
              {headline || "Your headline"}
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              {summary || "Your professional summary will appear here."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(skills
                ? skills.split(",").map((s) => s.trim()).filter(Boolean)
                : ["Skills"]
              ).map((s) => (
                <span key={s} className="border border-line bg-white px-2 py-1 text-xs">
                  {s}
                </span>
              ))}
            </div>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand">
              Education
            </h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink/70">
              {education || "—"}
            </p>
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand">
              Projects
            </h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink/70">
              {projects || "—"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
