import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Registered Colleges",
};

const colleges = [
  {
    name: "Osmania University Affiliated Colleges",
    district: "Hyderabad",
    streams: "Engineering, Degree, PG",
    students: "18,400+",
  },
  {
    name: "JNTUH Network Institutions",
    district: "Rangareddy",
    streams: "Engineering, Pharmacy",
    students: "22,100+",
  },
  {
    name: "Warangal Regional Cluster",
    district: "Warangal",
    streams: "Engineering, Polytechnic",
    students: "9,800+",
  },
  {
    name: "Karimnagar District Colleges",
    district: "Karimnagar",
    streams: "Degree, Polytechnic",
    students: "7,200+",
  },
  {
    name: "Nizamabad Skill Corridor",
    district: "Nizamabad",
    streams: "Degree, Vocational",
    students: "5,600+",
  },
  {
    name: "Khammam Industry Link Colleges",
    district: "Khammam",
    streams: "Engineering, Pharmacy",
    students: "6,100+",
  },
];

export default function CollegesPage() {
  return (
    <>
      <PageHero
        eyebrow="Academia network"
        title="TASK-registered colleges across Telangana"
        description="District-level institutional coverage for trainings, faculty development, campus hiring, and mentorship enablement."
        primaryHref="/register"
        primaryLabel="College registration"
        secondaryHref="/courses"
        secondaryLabel="Skill offerings"
      />
      <section className="section-pad">
        <div className="container-page grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {colleges.map((college, i) => (
            <FadeIn key={college.name} delay={i * 0.04}>
              <article className="h-full border border-line bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  {college.district}
                </p>
                <h2 className="mt-3 font-display text-xl">{college.name}</h2>
                <p className="mt-2 text-sm text-ink/65">{college.streams}</p>
                <p className="mt-4 text-sm font-semibold text-brand-deep">
                  {college.students} TASK learners
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
        <div className="container-page mt-10">
          <div className="border border-line bg-sand p-6">
            <h3 className="font-display text-2xl">College coordinator access</h3>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Coordinators and college management can sign in with their role to monitor
              enrollments, placements, and faculty development pathways.
            </p>
            <Link href="/login" className="btn-primary mt-5">
              Coordinator / Management login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
