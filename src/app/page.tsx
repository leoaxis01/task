import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  MapPinned,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { courseCategories } from "@/data/courses";
import { commandStats, ecosystemModules, outcomes } from "@/data/portal";

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(7,53,40,0.92) 0%, rgba(7,53,40,0.72) 42%, rgba(12,31,26,0.35) 100%), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-hero-glow mix-blend-soft-light" />
        <div className="container-page relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 sm:pb-20">
          <p className="eyebrow text-accent animate-fade-up">
            Government of Telangana · ITE&amp;C
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-up [animation-delay:90ms]">
            TASK
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85 sm:text-xl animate-fade-up [animation-delay:150ms]">
            AI-enabled skill, mentorship &amp; employment ecosystem for Telangana
            youth.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:220ms]">
            <Link href="/register" className="btn-accent">
              Register as student
            </Link>
            <Link
              href="/courses/engineering"
              className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              Explore engineering courses
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-10">
        <div className="container-page grid grid-cols-2 gap-6 sm:grid-cols-4">
          {commandStats.slice(0, 4).map((stat) => (
            <div key={stat.label} className="border-l border-brand/25 pl-3">
              <p className="font-display text-2xl text-brand-deep sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">TASK 2.0</p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
              One digital backbone connecting students, institutions, mentors,
              industry &amp; government.
            </h2>
            <p className="lede mt-4">
              Built for platform modernization, AI personalization, statewide
              mentorship, rural access, skill-gap intelligence, and integrated
              digital job centres.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemModules.map((module, index) => (
              <FadeIn key={module.href} delay={index * 0.05}>
                <Link
                  href={module.href}
                  className="group block h-full border border-line bg-white/80 p-6 transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                    {module.tag}
                  </span>
                  <h3 className="mt-3 font-display text-2xl text-ink group-hover:text-brand">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {module.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Open module <ArrowRight size={16} />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-sand section-pad">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Skill Offerings</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              Courses collection
            </h2>
            <p className="lede mt-3">
              Trainings offered to registered students through TASK — starting
              with the engineering catalogue referenced from the live portal.
            </p>
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courseCategories.map((cat, i) => (
              <FadeIn key={cat.slug} delay={i * 0.04}>
                <Link
                  href={`/courses/${cat.slug}`}
                  className="flex h-full flex-col border border-line bg-white p-5 transition hover:border-brand/40"
                >
                  <GraduationCap className="text-brand" size={22} />
                  <h3 className="mt-4 font-display text-xl">{cat.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/45">
                    {cat.audience}
                  </p>
                  <p className="mt-3 flex-1 text-sm text-ink/65">
                    {cat.description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-brand">
                    {cat.modules} modules →
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <FadeIn>
            <p className="eyebrow">AI capabilities</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              Guidance that adapts to every learner.
            </h2>
            <p className="lede mt-4">
              Career counselling, resume intelligence, job and skill
              recommendations, predictive employability scoring, and chatbot
              support — designed mobile-first for district-level access.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: BrainCircuit,
                  title: "Skill recommendations",
                  text: "Learning paths from live industry demand signals.",
                },
                {
                  icon: UsersRound,
                  title: "Mentor matching",
                  text: "AI pairing across alumni, industry & leaders.",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Job matching",
                  text: "Campus hiring, gigs, internships & schemes.",
                },
                {
                  icon: MapPinned,
                  title: "District inclusion",
                  text: "Rural reach with multi-language support.",
                },
              ].map((item) => (
                <div key={item.title} className="border border-line bg-white/70 p-4">
                  <item.icon className="text-brand" size={20} />
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink/65">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden border border-line bg-brand-deep p-8 text-white shadow-lift">
              <Sparkles className="absolute right-6 top-6 animate-float text-accent" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Employability snapshot
              </p>
              <p className="mt-4 font-display text-5xl">78</p>
              <p className="mt-1 text-sm text-white/70">Industry readiness index</p>
              <div className="mt-8 space-y-3">
                {[
                  { label: "Technical skills", value: 82 },
                  { label: "Soft skills", value: 74 },
                  { label: "Interview readiness", value: 69 },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex justify-between text-xs text-white/70">
                      <span>{bar.label}</span>
                      <span>{bar.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/15">
                      <div
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/skill-gap" className="btn-accent mt-8">
                Run skill gap analysis
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-line bg-white section-pad">
        <div className="container-page">
          <FadeIn>
            <p className="eyebrow">Expected outcomes</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              Built for students, government, industry &amp; Telangana.
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((block, i) => (
              <FadeIn key={block.audience} delay={i * 0.05}>
                <div className="h-full border border-line p-5">
                  <h3 className="font-display text-2xl text-brand-deep">
                    {block.audience}
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-ink/70">
                    {block.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
