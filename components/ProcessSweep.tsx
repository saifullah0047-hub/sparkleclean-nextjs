"use client";

import { useEffect, useRef, useState } from "react";

const PARTICLE_COUNT = 12;

function Particles() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const left = 12 + (76 / (PARTICLE_COUNT - 1)) * i;
    const size = 4 + (i % 3) * 2;
    const delay = (i * 0.35) + Math.random() * 0.5;
    const drift = (i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 8);
    return (
      <span
        key={i}
        className="process-particle"
        style={{
          left: `${left}%`,
          width: size,
          height: size,
          animationDelay: `${delay}s`,
          "--drift": `${drift}px`,
        } as React.CSSProperties}
      />
    );
  });
  return <>{particles}</>;
}

export default function ProcessSweep({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setActive(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setActive(true);
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`process-sweep${active ? " is-active" : ""}`}>
      {children}
      {active && <Particles />}
    </div>
  );
}
