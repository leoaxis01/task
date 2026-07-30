"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { usePortal } from "@/lib/portal-store";

export default function EmployersPage() {
  const router = useRouter();
  const { user, jobs, applications, postJob, hydrated } = usePortal();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Hyderabad");
  const [type, setType] = useState("Full-time");
  const [skills, setSkills] = useState("Java, Communication");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const myJobs = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.employerId === user?.id ||
          (user?.company && j.company === user.company)
      ),
    [jobs, user]
  );

  const applicants = useMemo(() => {
    const ids = new Set(myJobs.map((j) => j.id));
    return applications.filter((a) => a.jobId && ids.has(a.jobId));
  }, [applications, myJobs]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login?next=/employers");
      return;
    }
    if (user.role !== "Employer" && user.role !== "Government Admin") {
      setError("Register/sign in with Employer role to post jobs.");
      return;
    }
    setError("");
    const err = await postJob({
      title,
      company: company || user.company || user.name,
      location,
      type,
      skills,
      description,
    });
    if (err) {
      setError(err);
      return;
    }
    setMessage(`Posted: ${title}`);
    setTitle("");
    setDescription("");
  }

  if (!hydrated) {
    return <div className="container-page py-20 text-sm text-ink/60">Loading employer hub...</div>;
  }

  return (
    <>
      <PageHero
        eyebrow="Digital Job Centres · Employer Hub"
        title="Post roles and track TASK talent"
        description="Employers and MSMEs can publish openings, review applicants, and participate in campus / virtual job fairs."
        primaryHref="/job-fair"
        primaryLabel="Join job fair"
        secondaryHref="/register"
        secondaryLabel="Register as employer"
      />

      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr]">
          <FadeIn>
            <form onSubmit={onSubmit} className="border border-line bg-white p-6">
              <h2 className="font-display text-2xl">Post a job</h2>
              <label className="mt-4 block text-sm font-medium">
                Title
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
              <label className="mt-4 block text-sm font-medium">
                Company
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                  placeholder={user?.company || "Organisation"}
                />
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Location
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 w-full border border-line bg-mist px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Type
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 w-full border border-line bg-mist px-3 py-2"
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Trainee</option>
                    <option>Campus</option>
                  </select>
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium">
                Skills (comma separated)
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
              <label className="mt-4 block text-sm font-medium">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-24 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
              <button type="submit" className="btn-primary mt-6">
                Publish to Job Centres
              </button>
              {message ? <p className="mt-3 text-sm text-brand">{message}</p> : null}
              {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            </form>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="border border-line bg-white p-6">
              <h2 className="font-display text-2xl">Your postings</h2>
              {myJobs.length === 0 ? (
                <p className="mt-4 text-sm text-ink/60">
                  No employer-owned jobs yet. Post one to start receiving TASK applicants.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {myJobs.map((j) => (
                    <li key={j.id} className="border border-line bg-mist px-3 py-2 text-sm">
                      <p className="font-medium">{j.title}</p>
                      <p className="text-ink/55">
                        {j.location} · {j.type}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="mt-8 font-display text-xl">Applicant pulse</h3>
              <p className="mt-2 text-sm text-ink/65">
                {applicants.length} tracked applications linked to your postings in this environment.
              </p>
              <Link href="/jobs" className="btn-secondary mt-4">
                View public job board
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
