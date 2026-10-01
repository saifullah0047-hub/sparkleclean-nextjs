import Button from "@/components/Button";

type Feature = {
  text: string;
  muted?: boolean;
};

export type PricingCardProps = {
  name: string;
  sub: string;
  price: string;
  period: string;
  features: Feature[];
  cta: string;
  ctaVariant?: "primary" | "accent" | "outline-primary";
  popular?: boolean;
  popularLabel: string;
};

export default function PricingCard({
  name,
  sub,
  price,
  period,
  features,
  cta,
  ctaVariant = "outline-primary",
  popular = false,
  popularLabel,
}: PricingCardProps) {
  return (
    <div className={`pricing-card${popular ? " popular" : ""}`}>
      {popular && (
        <span className="popular-ribbon">
          <i className="fa-solid fa-star"></i> {popularLabel}
        </span>
      )}
      <div className="plan-name">{name}</div>
      <div className="plan-sub">{sub}</div>
      <div className="price">
        <span className="currency">$</span>
        {price}
        <span className="period">{period}</span>
      </div>
      <ul className="features">
        {features.map((feature) => (
          <li key={feature.text} className={feature.muted ? "muted" : ""}>
            <i className={`fa-solid ${feature.muted ? "fa-xmark" : "fa-check"}`}></i>{" "}
            {feature.text}
          </li>
        ))}
      </ul>
      <Button href="/book" variant={ctaVariant} className="w-100">
        {cta}
      </Button>
    </div>
  );
}
