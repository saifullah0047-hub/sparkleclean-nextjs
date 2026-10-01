"use client";

import { useEffect, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeImg: string;
  afterImg: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export default function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
}: BeforeAfterSliderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);

  useEffect(() => {
    const update = (x: number) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width)) * 100;
      setPos(pct);
    };

    const onPointerMove = (e: Event) => {
      if (draggingRef.current) update((e as PointerEvent).clientX);
    };
    const onPointerUp = () => {
      draggingRef.current = false;
      setDragging(false);
      document.body.style.userSelect = "";
    };
    const onPointerDown = (e: Event) => {
      e.preventDefault();
      draggingRef.current = true;
      setDragging(true);
      document.body.style.userSelect = "none";
      update((e as PointerEvent).clientX);
    };

    const handle = wrapRef.current?.querySelector(".ba-handle");
    handle?.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      handle?.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div className="ba-wrap" id="beforeAfter" ref={wrapRef}>
      <div className="ba-after">
        <img src={afterImg} alt={afterAlt} loading="lazy" />
      </div>
      <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={beforeImg} alt={beforeAlt} loading="lazy" />
      </div>
      <div
        className={`ba-handle${dragging ? " dragging" : ""}`}
        style={{ left: `${pos}%`, touchAction: "none" }}
        role="slider"
        aria-label="Before and after slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
      >
        <span className="knob">
          <i className="fa-solid fa-arrows-left-right"></i>
        </span>
      </div>
      {beforeLabel && <span className="ba-label before">{beforeLabel}</span>}
      {afterLabel && <span className="ba-label after">{afterLabel}</span>}
    </div>
  );
}