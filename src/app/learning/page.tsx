import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { learningTracks } from "@/data/portal";

export const metadata: Metadata = {
  title: "Learning Hub",
};

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
  return (
    <>
      <PageHero
        eyebrow="Module 5.5 · Knowledge Enhancement & Learning Hub"
        title="Learn, practice, certify — guided by AI pathways"
        description="From live classrooms and coding labs to soft skills and mock interviews, the Learning Hub prepares TASK students for industry readiness."
        primaryHref="/courses/engineering"
        primaryLabel="Browse engineering modules"
        secondaryHref="/register"
        secondaryLabel="Start learning"
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

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {learningTracks.map((track, i) => (
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
                  <Link href="/register" className="btn-secondary mt-6">
                    Enrol in track
                  </Link>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
