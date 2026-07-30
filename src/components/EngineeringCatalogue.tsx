"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { engineeringCourses, partnerOfferings } from "@/data/courses";
import { usePortal } from "@/lib/portal-store";

export function EngineeringCatalogue() {
  const router = useRouter();
  const { user, enrollments, enrollCourse } = usePortal();
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("All");
  const [flash, setFlash] = useState("");

  const technologies = useMemo(
    () => ["All", ...Array.from(new Set(engineeringCourses.map((c) => c.technology)))],
    []
  );

  const filtered = useMemo(() => {
    return engineeringCourses.filter((row) => {
      const hay = `${row.technology} ${row.module} ${row.specialization} ${row.year}`.toLowerCase();
      const q = query.toLowerCase();
      const matchesQuery = !q || hay.includes(q);
      const matchesTech = tech === "All" || row.technology === tech;
      return matchesQuery && matchesTech;
    });
  }, [query, tech]);

  function onEnrol(technology: string, module: string) {
    if (!user) {
      router.push("/login?next=/courses/engineering");
      return;
    }
    enrollCourse(technology, module);
    setFlash(`Enrolled: ${technology} — ${module}`);
    setTimeout(() => setFlash(""), 2500);
  }

  function isEnrolled(technology: string, module: string) {
    return enrollments.some((e) => e.courseKey === `${technology}::${module}`);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">
            TASK technology &amp; skill modules
          </h2>
          <p className="mt-2 text-sm text-ink/65">
            Search, filter, and enrol. Active enrollments sync to your dashboard.
          </p>
        </div>
        <Link href="/dashboard" className="btn-secondary">
          View my enrollments ({enrollments.length})
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AutoCAD, Java, Python, CISCO..."
          className="border border-line bg-white px-3 py-2 text-sm"
        />
        <select
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          className="border border-line bg-white px-3 py-2 text-sm"
        >
          {technologies.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {flash ? (
        <p className="mt-3 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          {flash}
        </p>
      ) : null}

      <div className="table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Technology</th>
              <th>Training Module</th>
              <th>Specialization</th>
              <th>Year of study</th>
              <th>Live</th>
              <th>Virtual</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const enrolled = isEnrolled(row.technology, row.module);
              return (
                <tr key={`${row.technology}-${row.module}`}>
                  <td className="font-medium text-ink">{row.technology}</td>
                  <td>{row.module}</td>
                  <td>{row.specialization}</td>
                  <td>{row.year}</td>
                  <td>{row.live}</td>
                  <td>{row.virtual}</td>
                  <td>
                    <button
                      type="button"
                      disabled={enrolled}
                      onClick={() => onEnrol(row.technology, row.module)}
                      className={`btn px-3 py-1.5 text-xs ${
                        enrolled
                          ? "cursor-default bg-brand-soft text-brand-deep"
                          : "btn-primary"
                      }`}
                    >
                      {enrolled ? "Enrolled" : "Enrol"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-ink/55">
                  No modules match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 font-display text-2xl sm:text-3xl">
        Corporate partnership offerings
      </h2>
      <p className="mt-2 text-sm text-ink/65">
        Partner modules offered at no cost or subsidized rates.
      </p>
      <div className="table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Modules / Offerings</th>
              <th>Specialization</th>
              <th>Year</th>
              <th>Mode</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {partnerOfferings.map((row) => {
              const enrolled = isEnrolled(row.partner, row.modules);
              return (
                <tr key={row.partner}>
                  <td className="font-medium text-ink">{row.partner}</td>
                  <td>{row.modules}</td>
                  <td>{row.specialization}</td>
                  <td>{row.year}</td>
                  <td>{row.mode}</td>
                  <td>{row.duration}</td>
                  <td>
                    <button
                      type="button"
                      disabled={enrolled}
                      onClick={() => onEnrol(row.partner, row.modules)}
                      className={`btn px-3 py-1.5 text-xs ${
                        enrolled
                          ? "cursor-default bg-brand-soft text-brand-deep"
                          : "btn-primary"
                      }`}
                    >
                      {enrolled ? "Enrolled" : "Enrol"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
