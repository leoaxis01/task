"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { usePortal } from "@/lib/portal-store";

const booths = [
  { name: "IT & Cloud Arena", focus: "Java, Cloud, Full Stack", rooms: 12 },
  { name: "Core Engineering Hall", focus: "AutoCAD, PLC, Embedded", rooms: 8 },
  { name: "Pharma & Analytics Desk", focus: "Python, Data, Domain", rooms: 6 },
  { name: "MSME & Gig Corner", focus: "Freelance, District roles", rooms: 10 },
];

export default function JobFairPage() {
  const router = useRouter();
  const { user, jobs, applyJob } = usePortal();
  const [joined, setJoined] = useState<string[]>([]);
  const [flash, setFlash] = useState("");

  const fairJobs = useMemo(
    () => jobs.filter((j) => j.type === "Campus" || j.company.includes("Fair") || j.match),
    [jobs]
  );

  function joinBooth(name: string) {
    if (!user) {
      router.push("/login?next=/job-fair");
      return;
    }
    setJoined((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setFlash(`Joined booth: ${name}`);
  }

  async function quickApply(jobId: string, title: string) {
    if (!user) {
      router.push("/login?next=/job-fair");
      return;
    }
    await applyJob(jobId);
    setFlash(`Applied via job fair: ${title}`);
  }

  return (
    <>
      <PageHero
        eyebrow="Virtual Job Fair"
        title="Meet employers across Telangana — online"
        description="Enter industry booths, attend mentor talks, and apply to campus drives without leaving the TASK portal."
        primaryHref="/jobs"
        primaryLabel="Browse all jobs"
        secondaryHref="/employers"
        secondaryLabel="Employer registration"
      />

      <section className="section-pad">
        <div className="container-page">
          {flash ? (
            <p className="mb-6 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
              {flash}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            {booths.map((booth, i) => (
              <FadeIn key={booth.name} delay={i * 0.04}>
                <article className="border border-line bg-white p-5">
                  <h2 className="font-display text-2xl">{booth.name}</h2>
                  <p className="mt-2 text-sm text-ink/65">{booth.focus}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-brand">
                    {booth.rooms} live rooms
                  </p>
                  <button
                    type="button"
                    className="btn-primary mt-4"
                    onClick={() => joinBooth(booth.name)}
                  >
                    {joined.includes(booth.name) ? "Booth joined" : "Enter booth"}
                  </button>
                </article>
              </FadeIn>
            ))}
          </div>

          <h3 className="mt-12 font-display text-3xl">Fair opportunities</h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {fairJobs.slice(0, 6).map((job) => (
              <article key={job.id} className="border border-line bg-white p-5">
                <h4 className="font-display text-xl">{job.title}</h4>
                <p className="mt-1 text-sm text-ink/65">
                  {job.company} · {job.location}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => quickApply(job.id, job.title)}
                  >
                    Quick apply
                  </button>
                  <Link href="/resume" className="btn-secondary">
                    Update resume
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
