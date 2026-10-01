"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  direction?: "" | "fade" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
};

export default function Reveal({
  children,
  direction = "",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("revealed");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("revealed"), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} data-reveal={direction} data-delay={delay} className={className}>
      {children}
    </div>
  );
}