"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { usePortal, type UserRole } from "@/lib/portal-store";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, user } = usePortal();
  const [role, setRole] = useState<UserRole>("Student");
  const [email, setEmail] = useState("student@task.telangana.gov.in");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = login(email, role);
    if (!ok) {
      setError("Enter a valid email / TASK ID.");
      return;
    }
    const next = params.get("next") || "/dashboard";
    router.push(next);
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-white p-6 sm:p-8">
      {user ? (
        <p className="mb-4 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          Already signed in as {user.name}.{" "}
          <Link href="/dashboard" className="font-semibold underline">
            Go to dashboard
          </Link>
        </p>
      ) : null}
      <label className="block text-sm font-medium">
        Role
        <select
          className="mt-1 w-full border border-line bg-mist px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border border-line bg-mist px-3 py-2"
          placeholder="student@college.edu"
        />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Password
        <input
          required
          type="password"
          defaultValue="task2026"
          className="mt-1 w-full border border-line bg-mist px-3 py-2"
          placeholder="••••••••"
        />
      </label>
      <button type="submit" className="btn-primary mt-6 w-full">
        Sign in to portal
      </button>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      <p className="mt-4 text-sm text-ink/60">
        New to TASK?{" "}
        <Link href="/register" className="font-semibold text-brand">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Portal access"
        title="Sign in to TASK 2.0"
        description="Students, coordinators, college management, mentors, employers, and government admins access role-based services through a secure session."
      />
      <section className="section-pad">
        <div className="container-page max-w-lg">
          <Suspense fallback={<div className="text-sm text-ink/60">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
