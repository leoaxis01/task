import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { commandStats, districtHeat } from "@/data/portal";

export const metadata: Metadata = {
  title: "Command & Control Centre",
};

const dashboards = [
  "District-wise employment statistics",
  "Placement analytics",
  "Institution performance",
  "Mentor engagement metrics",
  "Industry participation",
  "Training completion rates",
  "Skill demand forecasting",
  "Gender and rural participation tracking",
];

export default function CommandCentrePage() {
  return (
    <>
      <PageHero
        eyebrow="Module 5.4 · Command & Control Centre"
        title="Centralized governance and monitoring for TASK 2.0"
        description="Real-time policy insights, transparent monitoring, and faster intervention planning across Telangana’s skill and employment ecosystem."
        primaryHref="/skill-gap"
        primaryLabel="Open skill intelligence"
        secondaryHref="/jobs"
        secondaryLabel="View job centre activity"
      />

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {commandStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-line bg-white p-5"
                >
                  <p className="stat-num">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink/65">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <FadeIn>
              <div className="border border-line bg-white p-6">
                <h2 className="font-display text-2xl">Dashboard coverage</h2>
                <ul className="mt-4 space-y-2">
                  {dashboards.map((item) => (
                    <li
                      key={item}
                      className="border-b border-ink/10 py-2 text-sm text-ink/75 last:border-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="border border-line bg-brand-deep p-6 text-white">
                <h2 className="font-display text-2xl text-accent">
                  Placement pulse by district
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Demo analytics view — production will connect to Power BI and
                  secure API gateways.
                </p>
                <div className="mt-6 space-y-4">
                  {districtHeat.slice(0, 6).map((d) => {
                    const conversion = Math.round((d.supply / d.demand) * 100);
                    return (
                      <div key={d.district}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{d.district}</span>
                          <span className="text-accent">{conversion}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/15">
                          <div
                            className="h-2 rounded-full bg-accent"
                            style={{ width: `${Math.min(100, conversion)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
