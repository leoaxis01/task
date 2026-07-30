import Link from "next/link";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-sand">
      <div className="absolute inset-0 bg-hero-glow opacity-80" />
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="container-page relative py-14 sm:py-16">
        {eyebrow ? <p className="eyebrow animate-fade-up">{eyebrow}</p> : null}
        <h1 className="display mt-3 max-w-4xl animate-fade-up [animation-delay:80ms]">
          {title}
        </h1>
        <p className="lede mt-4 animate-fade-up [animation-delay:140ms]">
          {description}
        </p>
        {(primaryHref || secondaryHref) && (
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:200ms]">
            {primaryHref && primaryLabel ? (
              <Link href={primaryHref} className="btn-primary">
                {primaryLabel}
              </Link>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
