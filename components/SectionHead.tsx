type SectionHeadProps = {
  eyebrowIcon?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
};

export default function SectionHead({
  eyebrowIcon,
  eyebrow,
  title,
  subtitle,
  center = false,
  className = "",
}: SectionHeadProps) {
  return (
    <div className={`section-head${center ? " text-center" : ""} ${className}`}>
      <span className="section-eyebrow">
        {eyebrowIcon && <i className={`fa-solid ${eyebrowIcon}`}></i>} {eyebrow}
      </span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {center && <div className="divider"></div>}
    </div>
  );
}