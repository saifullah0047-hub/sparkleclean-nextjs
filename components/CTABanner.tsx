import Button from "@/components/Button";

type CTABannerProps = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryIcon?: string;
  floats?: string[];
};

export default function CTABanner({
  title,
  subtitle,
  primaryLabel,
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
  secondaryIcon,
  floats = ["fa-sparkles", "fa-spray-can-sparkles", "fa-broom"],
}: CTABannerProps) {
  return (
    <section className="section section-tight">
      <div className="container">
        <div className="cta-banner">
          {floats.map((icon, i) => (
            <i key={icon} className={`fa-solid ${icon} cta-float c${i + 1}`}></i>
          ))}
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href={primaryHref} variant="accent" size="lg" className="px-5">
              <i className="fa-solid fa-calendar-check"></i> {primaryLabel}
            </Button>
            {secondaryLabel && secondaryHref && (
              <Button href={secondaryHref} variant="outline-light" size="lg" className="px-5">
                {secondaryIcon && <i className={`fa-solid ${secondaryIcon}`}></i>} {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}