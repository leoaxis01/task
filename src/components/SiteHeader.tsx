"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { navItems } from "@/data/portal";
import { usePortal } from "@/lib/portal-store";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    logout,
    language,
    setLanguage,
    notifications,
    unreadCount,
    markNotificationsRead,
    hydrated,
  } = usePortal();
  const [open, setOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [query, setQuery] = useState("");

  const links = useMemo(() => {
    const base = [...navItems];
    if (user) base.unshift({ href: "/dashboard", label: "My Dashboard" });
    return base;
  }, [user]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

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
                  onClick={() => setLanguage(code)}
                  className={`px-2 py-0.5 ${
                    language === code ? "bg-accent text-ink" : "bg-transparent"
                  }`}
                  aria-pressed={language === code}
                >
                  {code === "EN" ? "English" : "తెలుగు"}
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
              {language === "TE"
                ? "తెలంగాణ నైపుణ్య మరియు జ్ఞాన అకాడమీ"
                : "Telangana Academy for Skill and Knowledge"}
            </span>
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          className="hidden max-w-xs flex-1 items-center gap-2 rounded-md border border-line bg-white px-3 py-1.5 lg:flex"
        >
          <Search size={16} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, jobs, mentors..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
        </form>

        <nav className="hidden items-center gap-3 2xl:gap-4 xl:flex">
          {links.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link whitespace-nowrap ${active ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {hydrated && user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  className="relative rounded-md border border-line bg-white p-2"
                  aria-label="Notifications"
                  onClick={() => {
                    setShowNotes((v) => !v);
                    markNotificationsRead();
                  }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>
                {showNotes ? (
                  <div className="absolute right-0 mt-2 w-80 border border-line bg-white shadow-lift">
                    <div className="border-b border-line px-3 py-2 text-sm font-semibold">
                      Notifications
                    </div>
                    <ul className="max-h-72 overflow-auto">
                      {notifications.length === 0 ? (
                        <li className="px-3 py-4 text-sm text-ink/55">
                          No notifications yet.
                        </li>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <li
                            key={n.id}
                            className="border-b border-line px-3 py-2 text-sm last:border-0"
                          >
                            <p className="font-medium">{n.title}</p>
                            <p className="text-ink/60">{n.body}</p>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
              <Link href="/dashboard" className="btn-secondary">
                <LayoutDashboard size={16} />
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  logout();
                  window.location.assign("/");
                }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
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
          <form onSubmit={onSearch} className="container-page flex gap-2 py-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search portal..."
              className="flex-1 border border-line bg-mist px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-primary">
              Go
            </button>
          </form>
          <nav className="container-page flex flex-col gap-1 pb-3">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink/80 hover:bg-brand-soft"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/resume"
              className="rounded-md px-3 py-2 text-sm font-medium text-ink/80 hover:bg-brand-soft"
              onClick={() => setOpen(false)}
            >
              Resume Builder
            </Link>
            <div className="mt-2 flex gap-2 px-1 pb-2">
              {user ? (
                <button
                  type="button"
                  className="btn-primary flex-1"
                  onClick={() => {
                    logout();
                    setOpen(false);
                    window.location.assign("/");
                  }}
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-secondary flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
