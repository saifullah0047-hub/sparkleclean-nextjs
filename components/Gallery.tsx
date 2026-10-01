import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import type { GalleryItem } from "@/data/types";

type GalleryProps = {
  eyebrowIcon?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  items: GalleryItem[];
};

export default function Gallery({ eyebrowIcon, eyebrow, title, subtitle, items }: GalleryProps) {
  return (
    <div>
      <Reveal>
        <SectionHead center eyebrowIcon={eyebrowIcon} eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </Reveal>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <Reveal
            key={item.img}
            delay={i * 70}
            className={`g-cell${item.size ? ` g-cell--${item.size}` : ""}`}
          >
            <figure className="gallery-item">
              <img src={item.img} alt={item.alt} loading="lazy" />
              {item.tag && <span className="g-tag">{item.tag}</span>}
              <figcaption>{item.label}</figcaption>
              <span className="g-view" aria-hidden="true">
                <i className="fa-solid fa-magnifying-glass-plus"></i>
              </span>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
