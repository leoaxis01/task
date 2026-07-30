import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { EngineeringCatalogue } from "@/components/EngineeringCatalogue";
import { courseCategories } from "@/data/courses";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return courseCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = courseCategories.find((c) => c.slug === slug);
  return { title: cat?.title ?? "Courses" };
}

export default async function CourseCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = courseCategories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const isEngineering = slug === "engineering";

  return (
    <>
      <PageHero
        eyebrow="Trainings offered to registered students through TASK"
        title={cat.title}
        description={
          isEngineering
            ? "Technology and soft-skill modules with live classroom and live virtual delivery — search, filter, and enrol directly into your Learning Hub."
            : cat.description
        }
        primaryHref="/register"
        primaryLabel="Register to access"
        secondaryHref="/dashboard"
        secondaryLabel="My dashboard"
      />

      <section className="section-pad">
        <div className="container-page">
          {isEngineering ? (
            <FadeIn>
              <EngineeringCatalogue />
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="border border-line bg-white p-8">
                <h2 className="font-display text-2xl">{cat.title}</h2>
                <p className="mt-3 max-w-2xl text-ink/70">{cat.description}</p>
                <p className="mt-6 text-sm text-ink/60">
                  Detailed module tables for this cohort follow the engineering
                  catalogue pattern. Switch to Engineering for the fully active
                  enrol experience, or register to unlock cohort-specific tracks.
                </p>
                <p className="mt-4 text-sm font-semibold text-brand">
                  {cat.modules} modules planned in TASK 2.0 catalogue
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
