"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PageHero } from "@/components/PageHero";

export default function LoginPage() {
  const [role, setRole] = useState("Student");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(
      `Signed-in demo for ${role}. Connect TASKLMS credentials in production.`
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Portal access"
        title="Sign in to TASK 2.0"
        description="Students, coordinators, college management, mentors, and employers access role-based services through a secure gateway."
      />
      <section className="section-pad">
        <div className="container-page max-w-lg">
          <form
            onSubmit={onSubmit}
            className="border border-line bg-white p-6 sm:p-8"
          >
            <label className="block text-sm font-medium">
              Role
              <select
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Student</option>
                <option>Coordinator</option>
                <option>College Management</option>
                <option>Mentor</option>
                <option>Employer</option>
                <option>Government Admin</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Email / TASK ID
              <input
                required
                type="text"
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                placeholder="student@college.edu"
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Password
              <input
                required
                type="password"
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="btn-primary mt-6 w-full">
              Sign in
            </button>
            {message ? (
              <p className="mt-4 text-sm text-brand">{message}</p>
            ) : null}
            <p className="mt-4 text-sm text-ink/60">
              New to TASK?{" "}
              <Link href="/register" className="font-semibold text-brand">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
