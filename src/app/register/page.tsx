"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { usePortal, type UserRole } from "@/lib/portal-store";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = usePortal();
  const [role, setRole] = useState<UserRole>("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("Hyderabad");
  const [stream, setStream] = useState("Engineering");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    register({
      name,
      email,
      mobile,
      role,
      district,
      stream,
      college: "TASK Registered College",
    });
    router.push("/dashboard");
  }

  return (
    <>
      <PageHero
        eyebrow="New registration"
        title="Join the TASK employability ecosystem"
        description="Create your active portal account to enrol in courses, request mentors, apply to jobs, and track your employability score."
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
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option>Student</option>
                <option>Mentor</option>
                <option>Employer</option>
                <option>Coordinator</option>
                <option>College Management</option>
                <option>Government Admin</option>
              </select>
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Full name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium">
                Mobile
                <input
                  required
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2"
                />
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              District
              <select
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option>Hyderabad</option>
                <option>Rangareddy</option>
                <option>Warangal</option>
                <option>Karimnagar</option>
                <option>Nizamabad</option>
                <option>Khammam</option>
                <option>Nalgonda</option>
                <option>Adilabad</option>
                <option>Other Telangana district</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Course / Stream
              <select
                className="mt-1 w-full border border-line bg-mist px-3 py-2"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
              >
                <option>Engineering</option>
                <option>Degree</option>
                <option>Pharmacy</option>
                <option>Polytechnic</option>
                <option>MBA / MCA / PG</option>
              </select>
            </label>
            <button type="submit" className="btn-primary mt-6 w-full">
              Create account &amp; open dashboard
            </button>
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
