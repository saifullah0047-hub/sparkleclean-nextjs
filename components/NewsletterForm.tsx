"use client";

import { useRef, useState } from "react";

type NewsletterFormProps = {
  variant?: "default" | "wide";
  placeholder: string;
};

export default function NewsletterForm({ variant = "default", placeholder }: NewsletterFormProps) {
  const [invalid, setInvalid] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: variant === "wide" ? "footer-wide" : "footer" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to subscribe");
      }

      setSuccessMessage(result.message || "Successfully subscribed!");
      setDone(true);
      input.value = "";
      formRef.current?.reset();

      setTimeout(() => {
        setDone(false);
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `form-control${invalid ? " is-invalid" : ""}${variant === "wide" ? " bg-light text-dark" : ""}`;

  return (
    <form ref={formRef} className="footer-newsletter" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <input
          ref={inputRef}
          type="email"
          className={inputClass}
          placeholder={placeholder}
          required
          aria-label="Email address"
          disabled={loading}
        />
        <button
          className={`btn ${variant === "wide" ? "btn-primary" : "btn-accent px-3"}`}
          type="submit"
          style={
            variant === "wide"
              ? undefined
              : { borderRadius: "0 var(--radius-pill) var(--radius-pill) 0" }
          }
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : done ? (
            <i className="fa-solid fa-check"></i>
          ) : (
            <i className="fa-solid fa-paper-plane"></i>
          )}
        </button>
      </div>
      {error && <div className="invalid-feedback d-block mt-1">{error}</div>}
      {successMessage && !loading && (
        <div className="valid-feedback d-block mt-1">{successMessage}</div>
      )}
    </form>
  );
}