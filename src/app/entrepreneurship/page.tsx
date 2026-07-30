import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { startupPrograms } from "@/data/portal";

export const metadata: Metadata = {
  title: "Innovation & Entrepreneurship",
};

export default function EntrepreneurshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Module 5.6"
        title="Innovation & entrepreneurship for Telangana youth"
        description="Startup incubation support, innovation challenges, mentor access, investor connect, MSME enablement, and a statewide startup showcase — aligned with Telangana’s startup ecosystem."
        primaryHref="/register"
        primaryLabel="Submit your venture"
        secondaryHref="/mentorship"
        secondaryLabel="Find a founder mentor"
      />

      <section className="section-pad">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {startupPrograms.map((program, i) => (
            <FadeIn key={program.title} delay={i * 0.05}>
              <article className="h-full border border-line bg-white p-6">
                <h2 className="font-display text-2xl">{program.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {program.description}
                </p>
                <Link href="/register" className="btn-secondary mt-6">
                  Participate
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
