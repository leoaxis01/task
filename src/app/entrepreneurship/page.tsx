"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { startupPrograms } from "@/data/portal";
import { usePortal } from "@/lib/portal-store";

export default function EntrepreneurshipPage() {
  const router = useRouter();
  const { user, ventures, submitVenture } = usePortal();
  const [venture, setVenture] = useState("");
  const [program, setProgram] = useState(startupPrograms[0].title);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login?next=/entrepreneurship");
      return;
    }
    try {
      await submitVenture(program, venture);
      setSubmitted(true);
      setVenture("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Module 5.6"
        title="Innovation & entrepreneurship for Telangana youth"
        description="Submit ventures to incubation tracks, join innovation challenges, and connect with mentors and investors through TASK."
        primaryHref="/register"
        primaryLabel="Submit your venture"
        secondaryHref="/mentorship"
        secondaryLabel="Find a founder mentor"
      />

      <section className="section-pad">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {startupPrograms.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <article className="h-full border border-line bg-white p-6">
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {item.description}
                </p>
                <button
                  type="button"
                  className="btn-secondary mt-6"
                  onClick={() => setProgram(item.title)}
                >
                  Select track
                </button>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="container-page mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={onSubmit} className="border border-line bg-white p-6">
            <h3 className="font-display text-2xl">Submit a venture</h3>
            <label className="mt-4 block text-sm font-medium">
              Selected program
              <select
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              >
                {startupPrograms.map((p) => (
                  <option key={p.title}>{p.title}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Venture / idea title
              <input
                required
                value={venture}
                onChange={(e) => setVenture(e.target.value)}
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
              />
            </label>
            <button type="submit" className="btn-primary mt-6 w-full">
              Submit to TASK
            </button>
            {submitted ? (
              <p className="mt-3 text-sm text-brand">
                Submitted. Check notifications or{" "}
                <Link href="/dashboard" className="font-semibold underline">
                  dashboard
                </Link>
                .
              </p>
            ) : null}
            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
          </form>

          <div className="border border-line bg-sand p-6">
            <h3 className="font-display text-2xl">Your submissions</h3>
            {ventures.length === 0 ? (
              <p className="mt-3 text-sm text-ink/65">No ventures submitted yet.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {ventures.map((v) => (
                  <li key={v.id} className="border border-line bg-white px-3 py-2">
                    <p className="font-medium">{v.title}</p>
                    <p className="text-ink/55">{v.program}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
