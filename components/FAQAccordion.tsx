"use client";

import { useState } from "react";

export type FaqItem = {
  icon: string;
  question: string;
  answer: string;
};

export default function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(-1);

  return (
    <div className="accordion" id="faqAccordion">
      {items.map((item, i) => (
        <div className="faq-item" key={i}>
          <div className="accordion-item border-0 bg-transparent">
            <h3 className="accordion-header" id={`faq${i + 1}`}>
              <button
                className={`accordion-button${open === i ? "" : " collapsed"}`}
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <i className={`fa-solid ${item.icon} me-2 text-primary`}></i> {item.question}
              </button>
            </h3>
            <div
              id={`collapse${i + 1}`}
              className={`accordion-collapse collapse${open === i ? " show" : ""}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">{item.answer}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}