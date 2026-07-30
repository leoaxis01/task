import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navItems } from "@/data/portal";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-brand-deep text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-3xl tracking-tight">TASK</p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Telangana Academy for Skill and Knowledge — bridging Government,
            Academia, and Industry for youth employability.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-accent">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {navItems.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-accent">Useful links</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/about" className="hover:text-white">
                About TASK
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                My Dashboard
              </Link>
            </li>
            <li>
              <Link href="/resume" className="hover:text-white">
                Resume Builder
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Student Registration
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Portal Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-accent">Contact</p>
          <ul className="mt-3 space-y-3 text-sm text-white/75">
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>
                1st floor, Sanketika Vidya Bhavan, Masabtank, Hyderabad - 500028
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-accent" />
              <a href="tel:04035485290" className="hover:text-white">
                (040) 35485290
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-accent" />
              <a
                href="mailto:enquiry_task@telangana.gov.in"
                className="hover:text-white"
              >
                enquiry_task@telangana.gov.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © Content owned by Telangana Academy for Skill and Knowledge,
            ITE&amp;C Department, Government of Telangana
          </p>
          <p>TASK 2.0 · AI-enabled skill, mentorship &amp; employment ecosystem</p>
        </div>
      </div>
    </footer>
  );
}
