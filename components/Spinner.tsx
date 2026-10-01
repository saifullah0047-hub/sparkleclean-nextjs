"use client";

import { useEffect, useRef } from "react";

export default function Spinner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.classList.remove("show");
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="spinner"
      ref={ref}
      className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div className="spinner-icon" role="status">
        <i className="fa-solid fa-sparkles"></i>
      </div>
    </div>
  );
}