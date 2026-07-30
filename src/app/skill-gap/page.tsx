"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { districtHeat, skillProfile } from "@/data/portal";
import { usePortal } from "@/lib/portal-store";

export default function SkillGapPage() {
  const { user, assessment, saveAssessment } = usePortal();
  const [role, setRole] = useState(assessment?.role ?? "Software Engineer");
  const [focus, setFocus] = useState(assessment?.focus ?? "Cloud");
  const [saved, setSaved] = useState(false);

  const score = useMemo(() => {
    const base = skillProfile.score;
    const bump = focus === "Cloud" ? 2 : focus === "Data" ? 4 : focus === "Full Stack" ? 3 : 1;
    const roleBump = role.includes("Cloud") ? 3 : role.includes("Data") ? 2 : 0;
    return Math.min(95, base + bump + roleBump);
  }, [role, focus]);

  function onSave() {
    void saveAssessment({
      role,
      focus,
      score,
      updatedAt: new Date().toISOString(),
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    });
  }

  return (
    <>
      <PageHero
        eyebrow="Module 5.3 · Skill Gap Analysis Engine"
        title="AI-driven competency mapping for every learner"
        description="Profile skills against industry demand, review district heat maps, and save personalized learning recommendations to your TASK profile."
        primaryHref="/learning"
        primaryLabel="Open recommended path"
        secondaryHref="/dashboard"
        secondaryLabel="My score"
      />

      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr]">
          <FadeIn>
            <div className="border border-line bg-white p-6">
              <p className="eyebrow">Interactive assessment</p>
              <h2 className="mt-3 font-display text-2xl">
                Personalize your employability score
              </h2>
              <p className="mt-2 text-sm text-ink/65">
                {user
                  ? `${user.name} · ${user.stream} · ${user.district}`
                  : skillProfile.student}
              </p>

              <label className="mt-6 block text-sm font-medium">
                Target role
                <select
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Software Engineer</option>
                  <option>Cloud Associate</option>
                  <option>Data Analyst</option>
                  <option>Embedded Engineer</option>
                </select>
              </label>

              <label className="mt-4 block text-sm font-medium">
                Focus area
                <select
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                >
                  <option>Cloud</option>
                  <option>Data</option>
                  <option>Full Stack</option>
                  <option>Core Engineering</option>
                </select>
              </label>

              <div className="mt-8 flex items-end gap-4">
                <p className="font-display text-6xl text-brand-deep">{score}</p>
                <div className="pb-2 text-sm text-ink/65">
                  <p className="font-semibold text-ink">Employability score</p>
                  <p>Industry readiness index for {role}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Strengths
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-ink/70">
                    {skillProfile.strengths.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Gaps
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-ink/70">
                    {skillProfile.gaps.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Recommendations
                </p>
                <ul className="mt-2 space-y-2">
                  {skillProfile.recommendations.map((r) => (
                    <li
                      key={r}
                      className="border border-line bg-mist px-3 py-2 text-sm"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <button type="button" className="btn-primary mt-6" onClick={onSave}>
                Save score to profile
              </button>
              {saved ? (
                <p className="mt-3 text-sm text-brand">
                  Saved.{" "}
                  <Link href="/dashboard" className="font-semibold underline">
                    View on dashboard
                  </Link>
                </p>
              ) : null}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="border border-line bg-white p-6">
              <p className="eyebrow">District skill heat map</p>
              <h2 className="mt-3 font-display text-2xl">
                Demand vs supply signals
              </h2>
              <p className="mt-2 text-sm text-ink/65">
                Emerging technology tracking and district-level workforce
                intelligence for policy and placement planning.
              </p>
              <div className="mt-6 space-y-4">
                {districtHeat.map((d) => (
                  <div key={d.district}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium">{d.district}</span>
                      <span className="text-ink/55">
                        Demand {d.demand} · Supply {d.supply}
                      </span>
                    </div>
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-mist">
                      <div className="bg-brand" style={{ width: `${d.demand}%` }} />
                    </div>
                    <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-mist">
                      <div className="bg-accent" style={{ width: `${d.supply}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/command-centre" className="btn-primary mt-8">
                View command centre
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
