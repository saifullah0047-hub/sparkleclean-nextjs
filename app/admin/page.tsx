"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ContactStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  spam: number;
  today: number;
}

interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
}

interface AdminStats {
  contacts: ContactStats;
  newsletter: NewsletterStats;
  bookings: { total: number; pending: number; confirmed: number; completed: number; cancelled: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.data);
          } else {
            setError(data.message || "Failed to fetch stats");
          }
        } else if (response.status === 401) {
          window.location.href = "/admin/login";
        } else {
          setError("Failed to fetch stats");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="row g-4">
          {[1, 2, 3, 4].map((i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="stat-card">
                <div className="d-flex align-items-center">
                  <div className="spinner-border text-warning me-3" role="status" />
                  <div>
                    <div className="placeholder-wave">
                      <span className="placeholder col-6" style={{ height: "2rem" }} />
                      <span className="placeholder col-4" style={{ height: "0.875rem" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row g-4 mt-4">
          <div className="col-12">
            <div className="stat-card">
              <div className="placeholder-wave">
                <span className="placeholder col-4" style={{ height: "1.5rem" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="alert alert-danger" role="alert">
          <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="stat-card"><div className="d-flex align-items-center"><div className="stat-icon bg-primary-light text-primary"><i className="fa-solid fa-calendar-check"></i></div><div className="ms-3"><div className="stat-value">{stats?.bookings.total || 0}</div><div className="stat-label">Bookings</div><Link href="/admin/bookings" className="btn btn-sm btn-outline-primary mt-2">Manage</Link></div></div></div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-primary-light text-primary">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.contacts.total || 0}</div>
                <div className="stat-label">Total Contacts</div>
                <div className="stat-trend text-success">
                  <i className="fa-solid fa-arrow-up me-1"></i> {stats?.contacts.today || 0} today
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-info-light text-info">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.contacts.new || 0}</div>
                <div className="stat-label">New</div>
                <Link href="/admin/contacts?status=new" className="btn btn-sm btn-outline-primary mt-2">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-warning-light text-warning">
                <i className="fa-solid fa-spinner"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.contacts.inProgress || 0}</div>
                <div className="stat-label">In Progress</div>
                <Link href="/admin/contacts?status=in_progress" className="btn btn-sm btn-outline-warning mt-2">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-success-light text-success">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.contacts.resolved || 0}</div>
                <div className="stat-label">Resolved</div>
                <Link href="/admin/contacts?status=resolved" className="btn btn-sm btn-outline-success mt-2">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-secondary-light text-secondary">
                <i className="fa-solid fa-bell"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.newsletter.total || 0}</div>
                <div className="stat-label">Newsletter Subscribers</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-success-light text-success">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.newsletter.active || 0}</div>
                <div className="stat-label">Active</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-muted-light text-muted">
                <i className="fa-solid fa-user-slash"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats?.newsletter.unsubscribed || 0}</div>
                <div className="stat-label">Unsubscribed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="stat-card">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
              <h3 className="mb-0">Quick Actions</h3>
            </div>
            <div className="d-flex flex-wrap gap-3">
              <Link href="/admin/bookings" className="btn btn-primary"><i className="fa-solid fa-calendar-check me-2"></i> Manage Bookings</Link>
              <Link href="/admin/contacts" className="btn btn-primary">
                <i className="fa-solid fa-envelope me-2"></i> View All Contacts
              </Link>
              <Link href="/admin/newsletter" className="btn btn-outline-primary">
                <i className="fa-solid fa-bell me-2"></i> Manage Newsletter
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
                <i className="fa-solid fa-external-link-alt me-2"></i> View Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
