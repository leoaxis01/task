import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { mentors } from "@/data/portal";

export const metadata: Metadata = {
  title: "Mentorship Ecosystem",
};

const features = [
  "Mentor–mentee matching engine",
  "AI mentor recommendations",
  "Career guidance sessions",
  "Virtual mentorship rooms",
  "Industry webinars",
  "Interview preparation",
  "Goal tracking",
  "Certification pathways",
  "Discussion forums",
  "Community networking",
];

export default function MentorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Module 5.1"
        title="Statewide digital mentorship ecosystem"
        description="Connect students with industry experts, alumni, entrepreneurs, and government leaders — for industry exposure, rural talent upliftment, and career acceleration."
        primaryHref="/register"
        primaryLabel="Become a mentee"
        secondaryHref="/login"
        secondaryLabel="Mentor sign in"
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <p className="eyebrow">Key features</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">
              Mentorship that scales across districts.
            </h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {features.map((item) => (
                <li
                  key={item}
                  className="border border-line bg-white px-3 py-2 text-sm text-ink/75"
                >
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {mentors.map((mentor) => (
                <article
                  key={mentor.name}
                  className="border border-line bg-white p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft font-display text-lg text-brand-deep">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="mt-4 font-display text-xl">{mentor.name}</h3>
                  <p className="text-sm font-medium text-brand">{mentor.role}</p>
                  <p className="text-sm text-ink/60">{mentor.org}</p>
                  <p className="mt-3 text-sm text-ink/70">{mentor.focus}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-ink/45">
                    {mentor.district}
                  </p>
                  <Link href="/register" className="btn-secondary mt-4 w-full">
                    Request match
                  </Link>
                </article>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
