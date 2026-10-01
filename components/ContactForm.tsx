"use client";

import { useRef, useState } from "react";
import dataRaw from "@/data/data.json";
import type { FormField, FormsData } from "@/data/types";

const forms = dataRaw.forms as FormsData;

type ContactFormProps = {
  variant?: "panel" | "page";
};

function Field({ field, variant }: { field: FormField; variant: "panel" | "page" }) {
  const controlClass =
    field.type === "select" ? (variant === "panel" ? "form-select" : "form-control") : "form-control";

  if (field.type === "textarea") {
    return (
      <>
        {field.label && <label htmlFor={field.name}>{field.label}</label>}
        <textarea
          id={field.name}
          name={field.name}
          className={controlClass}
          rows={field.rows ?? 5}
          placeholder={field.placeholder}
          required={field.required}
        />
        {field.feedback && <div className="invalid-feedback">{field.feedback}</div>}
      </>
    );
  }

  if (field.type === "select") {
    return (
      <>
        {field.label && <label htmlFor={field.name}>{field.label}</label>}
        <select id={field.name} name={field.name} className={controlClass} defaultValue="">
          {field.selectPlaceholder && (
            <option value="" disabled={field.selectPlaceholderDisabled}>
              {field.selectPlaceholder}
            </option>
          )}
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </>
    );
  }

  return (
    <>
      {field.label && <label htmlFor={field.name}>{field.label}</label>}
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        className={controlClass}
        placeholder={field.placeholder}
        required={field.required}
      />
      {field.feedback && <div className="invalid-feedback">{field.feedback}</div>}
    </>
  );
}

export default function ContactForm({ variant = "panel" }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const config = forms.contact[variant];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const form = formRef.current;
    if (!form) return;

    setValidated(true);
    setError(null);
    setFieldErrors({});

    if (!form.checkValidity()) {
      return;
    }

    setLoading(true);

    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || undefined,
      "service-type": formData.get("service-type") as string || undefined,
      message: formData.get("message") as string,
      variant,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        throw new Error(result.message || "Failed to submit form");
      }

      setSuccess(true);
      form.reset();
      setValidated(false);
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formClass = `needs-validation${validated ? " was-validated" : ""}`;

  return (
    <form ref={formRef} className={formClass} onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        {config.fields.map((field) => (
          <div className={field.col ?? "col-12"} key={field.name}>
            <Field field={field} variant={variant} />
            {fieldErrors[field.name] && (
              <div className="invalid-feedback d-block">{fieldErrors[field.name][0]}</div>
            )}
          </div>
        ))}
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100 py-3" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : (
              <>
                {config.submit.icon && <i className={`fa-solid ${config.submit.icon}`}></i>}{" "}
                {config.submit.label}
              </>
            )}
          </button>
          {error && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
            </div>
          )}
          {config.success && variant === "panel" && (
            <div
              id="formSuccess"
              className={`alert alert-success mt-3 mb-0${success ? "" : " d-none"}`}
              role="alert"
            >
              <i className="fa-solid fa-circle-check me-2"></i> {config.success}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}