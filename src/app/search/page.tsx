"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { engineeringCourses } from "@/data/courses";
import { jobs, mentors, learningTracks, startupPrograms } from "@/data/portal";

function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [] as { type: string; title: string; href: string; meta: string }[];
    const items: { type: string; title: string; href: string; meta: string }[] = [];

    engineeringCourses.forEach((c) => {
      const hay = `${c.technology} ${c.module} ${c.specialization}`.toLowerCase();
      if (hay.includes(q)) {
        items.push({
          type: "Course",
          title: `${c.technology} — ${c.module}`,
          href: "/courses/engineering",
          meta: c.specialization,
        });
      }
    });

    jobs.forEach((j) => {
      const hay = `${j.title} ${j.company} ${j.skills.join(" ")}`.toLowerCase();
      if (hay.includes(q)) {
        items.push({
          type: "Job",
          title: j.title,
          href: "/jobs",
          meta: `${j.company} · ${j.type}`,
        });
      }
    });

    mentors.forEach((m) => {
      const hay = `${m.name} ${m.focus} ${m.role} ${m.district}`.toLowerCase();
      if (hay.includes(q)) {
        items.push({
          type: "Mentor",
          title: m.name,
          href: "/mentorship",
          meta: `${m.role} · ${m.focus}`,
        });
      }
    });

    learningTracks.forEach((t) => {
      if (`${t.title} ${t.items.join(" ")}`.toLowerCase().includes(q)) {
        items.push({
          type: "Learning",
          title: t.title,
          href: "/learning",
          meta: `${t.level} · ${t.duration}`,
        });
      }
    });

    startupPrograms.forEach((p) => {
      if (`${p.title} ${p.description}`.toLowerCase().includes(q)) {
        items.push({
          type: "Startup",
          title: p.title,
          href: "/entrepreneurship",
          meta: p.description,
        });
      }
    });

    return items;
  }, [q]);

  return (
    <div className="container-page">
      <p className="text-sm text-ink/65">
        {q
          ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`
          : "Enter a search term in the header."}
      </p>
      <div className="mt-6 space-y-3">
        {results.map((r) => (
          <Link
            key={`${r.type}-${r.title}`}
            href={r.href}
            className="block border border-line bg-white p-4 transition hover:border-brand/40"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              {r.type}
            </p>
            <h2 className="mt-1 font-display text-xl">{r.title}</h2>
            <p className="mt-1 text-sm text-ink/65">{r.meta}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Search"
        title="Find courses, jobs, mentors & programs"
        description="Portal-wide search across skill offerings, job centres, mentorship, learning tracks, and entrepreneurship."
      />
      <section className="section-pad">
        <Suspense fallback={<div className="container-page text-sm text-ink/60">Searching...</div>}>
          <SearchResults />
        </Suspense>
      </section>
    </>
  );
}
