import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About TASK",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Telangana Academy for Skill and Knowledge"
        description="Established by the Government of Telangana to enhance skilling synergy among institutions of Government, Industry & Academia — and evolving into TASK 2.0, an AI-enabled employability ecosystem."
        primaryHref="/register"
        primaryLabel="Join TASK"
        secondaryHref="/courses"
        secondaryLabel="View skill offerings"
      />

      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="border border-line bg-white p-6">
              <h2 className="font-display text-2xl">Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                Position Telangana as India’s leading digital employability and
                mentorship ecosystem — powered by cloud-native architecture,
                mobile-first design, real-time analytics, and secure digital
                governance.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.06}>
            <div className="border border-line bg-white p-6">
              <h2 className="font-display text-2xl">Modernization priorities</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink/70">
                <li>• Reengineer and modernize the TASK portal architecture</li>
                <li>• Unified employability ecosystem</li>
                <li>• Statewide mentorship programs</li>
                <li>• AI-based skill gap assessment</li>
                <li>• Integrated digital job centres</li>
                <li>• Rural and district-level digital inclusion</li>
              </ul>
            </div>
          </FadeIn>
        </div>
        <div className="container-page mt-8">
          <FadeIn>
            <div className="border border-line bg-sand p-6 sm:p-8">
              <h2 className="font-display text-2xl">Contact</h2>
              <p className="mt-3 text-sm text-ink/70">
                Telangana Academy For Skill and Knowledge, 1st floor, Sanketika
                Vidya Bhavan, Masabtank, Hyderabad - 500028
              </p>
              <p className="mt-2 text-sm text-ink/70">
                (040) 35485290 · enquiry_task@telangana.gov.in
              </p>
              <Link href="/login" className="btn-primary mt-6">
                Portal login
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
