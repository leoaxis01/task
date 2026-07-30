import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import {
  courseCategories,
  engineeringCourses,
  partnerOfferings,
} from "@/data/courses";

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
            ? "Technology and soft-skill modules with live classroom and live virtual delivery — aligned to specialization and year of study."
            : cat.description
        }
        primaryHref="/register"
        primaryLabel="Register to access"
        secondaryHref="/learning"
        secondaryLabel="Open Learning Hub"
      />

      <section className="section-pad">
        <div className="container-page">
          {isEngineering ? (
            <>
              <FadeIn>
                <h2 className="font-display text-2xl sm:text-3xl">
                  TASK technology &amp; skill modules
                </h2>
                <p className="mt-2 text-sm text-ink/65">
                  Sample catalogue modeled on the official engineering courses
                  listing.
                </p>
              </FadeIn>
              <FadeIn delay={0.05} className="mt-6">
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Technology</th>
                        <th>Training Module</th>
                        <th>Specialization</th>
                        <th>Year of study</th>
                        <th>Live Training</th>
                        <th>Live Virtual</th>
                        <th>Certification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {engineeringCourses.map((row) => (
                        <tr key={`${row.technology}-${row.module}`}>
                          <td className="font-medium text-ink">
                            {row.technology}
                          </td>
                          <td>{row.module}</td>
                          <td>{row.specialization}</td>
                          <td>{row.year}</td>
                          <td>{row.live}</td>
                          <td>{row.virtual}</td>
                          <td>{row.certification}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>

              <FadeIn className="mt-14">
                <h2 className="font-display text-2xl sm:text-3xl">
                  Corporate partnership offerings
                </h2>
                <p className="mt-2 text-sm text-ink/65">
                  Partner modules offered at no cost or subsidized rates to
                  colleges and students.
                </p>
              </FadeIn>
              <FadeIn delay={0.05} className="mt-6">
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Partner</th>
                        <th>Modules / Offerings</th>
                        <th>Specialization</th>
                        <th>Year of study</th>
                        <th>Mode</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnerOfferings.map((row) => (
                        <tr key={row.partner}>
                          <td className="font-medium text-ink">{row.partner}</td>
                          <td>{row.modules}</td>
                          <td>{row.specialization}</td>
                          <td>{row.year}</td>
                          <td>{row.mode}</td>
                          <td>{row.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>
            </>
          ) : (
            <FadeIn>
              <div className="border border-line bg-white p-8">
                <h2 className="font-display text-2xl">{cat.title}</h2>
                <p className="mt-3 max-w-2xl text-ink/70">{cat.description}</p>
                <p className="mt-6 text-sm text-ink/60">
                  Detailed module tables for this cohort will mirror the
                  engineering catalogue structure — technology, year of study,
                  live/virtual delivery, and certification partners.
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
