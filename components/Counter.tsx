"use client";

import { useEffect, useRef } from "react";

type CounterProps = {
  count: number;
  className?: string;
};

export default function Counter({ count, className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const isFloat = String(count).includes(".");
            const start = performance.now();
            const duration = 2200;
            const tick = (now: number) => {
              const progress = Math.min(1, (now - start) / duration);
              const value = isFloat
                ? (count * progress).toFixed(1)
                : String(Math.floor(count * progress));
              el.textContent = value;
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = isFloat ? count.toFixed(1) : String(Math.floor(count));
              }
            };
            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  return (
    <span ref={ref} className={`counter-value ${className}`.trim()}>
      0
    </span>
  );
}