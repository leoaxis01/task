"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PageHero } from "@/components/PageHero";

export default function RegisterPage() {
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(
      "Registration received (demo). Production flow integrates with TASKLMS student and college registration."
    );
  }

  return (
    <>
      <PageHero
        eyebrow="New registration"
        title="Join the TASK employability ecosystem"
        description="Register as a student, college, mentor, or employer to access skill offerings, mentorship, job centres, and AI career guidance."
      />
      <section className="section-pad">
        <div className="container-page max-w-xl">
          <form
            onSubmit={onSubmit}
            className="border border-line bg-white p-6 sm:p-8"
          >
            <label className="block text-sm font-medium">
              I am registering as
              <select
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                defaultValue="Student"
              >
                <option>Student</option>
                <option>College</option>
                <option>Mentor</option>
                <option>Employer</option>
                <option>Regional Centre</option>
              </select>
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Full name
                <input
                  required
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium">
                Mobile
                <input
                  required
                  type="tel"
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">
              Email
              <input
                required
                type="email"
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              District
              <select className="mt-1 w-full border border-line bg-mist px-3 py-2">
                <option>Hyderabad</option>
                <option>Rangareddy</option>
                <option>Warangal</option>
                <option>Karimnagar</option>
                <option>Nizamabad</option>
                <option>Other Telangana district</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Course / Stream
              <select className="mt-1 w-full border border-line bg-mist px-3 py-2">
                <option>Engineering</option>
                <option>Degree</option>
                <option>Pharmacy</option>
                <option>Polytechnic</option>
                <option>MBA / MCA / PG</option>
              </select>
            </label>
            <button type="submit" className="btn-primary mt-6 w-full">
              Submit registration
            </button>
            {message ? (
              <p className="mt-4 text-sm text-brand">{message}</p>
            ) : null}
            <p className="mt-4 text-sm text-ink/60">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-brand">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
