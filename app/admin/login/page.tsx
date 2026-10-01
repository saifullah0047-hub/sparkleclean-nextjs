"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import dataRaw from "@/data/data.json";
import type { SiteData } from "@/data/types";

const site = dataRaw.site as SiteData;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="login-brand">
          <Link href="/" className="brand-link">
            <i className={site.brandIcon}></i>
            <span>{site.brandPrefix}<span className="spark">{site.brandAccent}</span></span>
          </Link>
          <p className="text-muted mt-2">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer mt-4">
          <Link href="/" className="text-decoration-none">
            <i className="fa-solid fa-arrow-left me-1"></i> Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}