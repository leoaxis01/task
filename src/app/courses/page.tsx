import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { courseCategories } from "@/data/courses";

export const metadata: Metadata = {
  title: "Skill Offerings",
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Skill Offerings"
        title="Courses collection for TASK-registered students"
        description="Browse pathway catalogues across engineering, degree, pharmacy, polytechnic, and postgraduate cohorts — with live and virtual delivery options."
        primaryHref="/courses/engineering"
        primaryLabel="Engineering courses"
        secondaryHref="/register"
        secondaryLabel="Register to enrol"
      />
      <section className="section-pad">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {courseCategories.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.04}>
              <Link
                href={`/courses/${cat.slug}`}
                className="block border border-line bg-white p-6 transition hover:border-brand/35 hover:shadow-lift"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  {cat.audience}
                </p>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl">
                  {cat.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {cat.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-brand">
                  View catalogue ({cat.modules}) →
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
