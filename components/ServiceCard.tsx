import Link from "next/link";

type ServiceCardProps = {
  img: string;
  alt: string;
  icon: string;
  tag?: string;
  title: string;
  desc: string;
  price: string;
  note: string;
  ctaLabel: string;
  href?: string;
};

export default function ServiceCard({
  img,
  alt,
  icon,
  tag,
  title,
  desc,
  price,
  note,
  ctaLabel,
  href = "/book",
}: ServiceCardProps) {
  return (
    <div className="service-card">
      <div className="thumb">
        {tag && <span className="tag">{tag}</span>}
        <span className="icon-chip">
          <i className={`fa-solid ${icon}`}></i>
        </span>
        <img src={img} alt={alt} loading="lazy" />
      </div>
      <div className="body">
        <h3>{title}</h3>
        <p className="desc">{desc}</p>
        <div className="foot">
          <div className="price">
            {price}
            <small>{note}</small>
          </div>
          <Link href={href} className="link" prefetch={false}>
            {ctaLabel} <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
