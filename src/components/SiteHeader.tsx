"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navItems } from "@/data/portal";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "TE">("EN");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-mist/90 backdrop-blur-md">
      <div className="border-b border-ink/10 bg-brand-deep text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-1.5 text-[11px] sm:text-xs">
          <p className="opacity-90">
            Department of ITE&amp;C · Government of Telangana
          </p>
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="tel:04035485290">
              040-35485290
            </a>
            <a className="hover:underline" href="mailto:enquiry_task@telangana.gov.in">
              enquiry_task@telangana.gov.in
            </a>
            <div className="flex overflow-hidden rounded border border-white/25">
              {(["EN", "TE"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-0.5 ${
                    lang === code ? "bg-accent text-ink" : "bg-transparent"
                  }`}
                  aria-pressed={lang === code}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand text-sm font-bold text-white shadow-lift">
            TASK
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl leading-none tracking-tight text-brand-deep transition group-hover:text-brand sm:text-2xl">
              TASK
            </span>
            <span className="block truncate text-[11px] text-ink/60 sm:text-xs">
              Telangana Academy for Skill and Knowledge
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="btn-secondary">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary">
            Register
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-md border border-line bg-white p-2 xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white xl:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink/80 hover:bg-brand-soft"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-1 pb-2">
              <Link href="/login" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}

      <div className="hidden border-t border-ink/10 bg-white/60 lg:block">
        <div className="container-page flex items-center gap-6 overflow-x-auto py-2 text-xs text-ink/65">
          <span className="inline-flex items-center gap-1 font-semibold text-brand">
            Quick access <ChevronDown size={14} />
          </span>
          <Link href="/courses/engineering" className="hover:text-brand">
            Engineering courses
          </Link>
          <Link href="/jobs" className="hover:text-brand">
            Internship marketplace
          </Link>
          <Link href="/skill-gap" className="hover:text-brand">
            Employability score
          </Link>
          <Link href="/command-centre" className="hover:text-brand">
            District dashboards
          </Link>
        </div>
      </div>
    </header>
  );
}
