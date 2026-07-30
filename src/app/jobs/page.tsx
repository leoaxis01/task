import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { jobs } from "@/data/portal";

export const metadata: Metadata = {
  title: "Digital Job Centres",
};

const features = [
  "AI-powered job matching",
  "Internship marketplace",
  "Campus hiring platform",
  "Employer dashboards",
  "Virtual job fairs",
  "Resume builder",
  "Video profile creation",
  "Applicant tracking (ATS)",
  "Government scheme integration",
  "Gig & freelance opportunities",
];

export default function JobsPage() {
  return (
    <>
      <PageHero
        eyebrow="Module 5.2 · Telangana Digital Job Centres"
        title="Integrated employment exchange for youth & employers"
        description="Match talent to IT, manufacturing, pharma, startups, MSMEs, and global employers — with campus drives, internships, and scheme-linked opportunities."
        primaryHref="/register"
        primaryLabel="Build your profile"
        secondaryHref="/skill-gap"
        secondaryLabel="Improve match score"
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

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {jobs.map((job, i) => (
              <FadeIn key={job.title} delay={i * 0.04}>
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
                      {job.match}% match
                    </span>
                  </div>
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
                    <Link href="/register" className="btn-primary">
                      Apply
                    </Link>
                    <Link href="/learning" className="btn-secondary">
                      Upskill first
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
