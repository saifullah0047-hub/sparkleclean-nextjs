"use client";

import { Children } from "react";

const GAP = 20;

export default function TestimonialCarousel({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  const count = items.length;

  return (
    <div className="testimonial-track-wrap">
      <div className="testimonial-track" style={{ "--t-count": count, "--t-gap": `${GAP}px` } as React.CSSProperties}>
        {[...items, ...items].map((item, i) => (
          <div className="testimonial-slide" key={i} style={{ marginRight: i === count * 2 - 1 ? 0 : `${GAP}px` }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
