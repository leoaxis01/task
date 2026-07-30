"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { mentors } from "@/data/portal";
import { usePortal } from "@/lib/portal-store";

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
  const router = useRouter();
  const { user, mentorships, requestMentor } = usePortal();
  const [flash, setFlash] = useState("");

  function onRequest(name: string, focus: string) {
    if (!user) {
      router.push("/login?next=/mentorship");
      return;
    }
    requestMentor(name, focus);
    setFlash(`Mentorship requested with ${name}`);
    setTimeout(() => setFlash(""), 2500);
  }

  function requested(name: string) {
    return mentorships.some((m) => m.mentorName === name);
  }

  return (
    <>
      <PageHero
        eyebrow="Module 5.1"
        title="Statewide digital mentorship ecosystem"
        description="Connect with industry experts, alumni, entrepreneurs, and government leaders. Request a match and track status on your dashboard."
        primaryHref="/register"
        primaryLabel="Become a mentee"
        secondaryHref="/dashboard"
        secondaryLabel="My mentorship"
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
            {flash ? (
              <p className="mt-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
                {flash} ·{" "}
                <Link href="/dashboard" className="font-semibold underline">
                  Open dashboard
                </Link>
              </p>
            ) : null}
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              {mentors.map((mentor) => {
                const done = requested(mentor.name);
                return (
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
                    <button
                      type="button"
                      disabled={done}
                      onClick={() => onRequest(mentor.name, mentor.focus)}
                      className={`mt-4 w-full ${
                        done ? "btn bg-brand-soft text-brand-deep" : "btn-secondary"
                      }`}
                    >
                      {done ? "Requested" : "Request match"}
                    </button>
                  </article>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
