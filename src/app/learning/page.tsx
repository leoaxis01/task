"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { learningTracks } from "@/data/portal";
import { usePortal } from "@/lib/portal-store";

const features = [
  "AI learning assistant",
  "E-learning modules",
  "Live classrooms",
  "Recorded sessions",
  "Skill certifications",
  "Soft skill programs",
  "Coding labs",
  "Language training",
  "Mock interviews",
  "Career readiness pathways",
];

export default function LearningPage() {
  const router = useRouter();
  const { user, enrollments, enrollCourse } = usePortal();
  const [flash, setFlash] = useState("");

  function enrolTrack(title: string) {
    if (!user) {
      router.push("/login?next=/learning");
      return;
    }
    enrollCourse("Learning Hub", title);
    setFlash(`Enrolled in ${title}`);
    setTimeout(() => setFlash(""), 2200);
  }

  function enrolled(title: string) {
    return enrollments.some((e) => e.courseKey === `Learning Hub::${title}`);
  }

  return (
    <>
      <PageHero
        eyebrow="Module 5.5 · Knowledge Enhancement & Learning Hub"
        title="Learn, practice, certify — guided by AI pathways"
        description="Enrol in learning tracks, continue from your dashboard, and combine with engineering catalogues and mentor guidance."
        primaryHref="/courses/engineering"
        primaryLabel="Browse engineering modules"
        secondaryHref="/dashboard"
        secondaryLabel="My learning"
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

          {flash ? (
            <p className="mt-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
              {flash} ·{" "}
              <Link href="/dashboard" className="font-semibold underline">
                Open dashboard
              </Link>
            </p>
          ) : null}

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {learningTracks.map((track, i) => {
              const done = enrolled(track.title);
              return (
                <FadeIn key={track.title} delay={i * 0.05}>
                  <article className="h-full border border-line bg-white p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {track.level} · {track.duration}
                    </p>
                    <h2 className="mt-3 font-display text-2xl">{track.title}</h2>
                    <ul className="mt-4 space-y-2 text-sm text-ink/70">
                      {track.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      disabled={done}
                      onClick={() => enrolTrack(track.title)}
                      className={`mt-6 ${
                        done ? "btn bg-brand-soft text-brand-deep" : "btn-secondary"
                      }`}
                    >
                      {done ? "Enrolled" : "Enrol in track"}
                    </button>
                  </article>
                </FadeIn>
              );
            })}
          </div>

          {enrollments.length > 0 ? (
            <div className="mt-12 border border-line bg-sand p-6">
              <h3 className="font-display text-2xl">Continue learning</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {enrollments.slice(0, 6).map((e) => (
                  <li key={e.id} className="border border-line bg-white px-3 py-2">
                    {e.technology} — {e.module}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
