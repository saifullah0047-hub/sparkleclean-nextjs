"use client";

import { useEffect, useState, useCallback } from "react";

interface NewsletterSubscription {
  id: number;
  email: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface NewsletterResponse {
  success: boolean;
  data: NewsletterSubscription[];
  pagination: Pagination;
  stats: {
    total: number;
    active: number;
    unsubscribed: number;
  };
}

export default function AdminNewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [stats, setStats] = useState<NewsletterResponse["stats"]>({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/newsletter?${params}`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubscriptions(data.data);
          setPagination(data.pagination);
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to fetch subscriptions");
        }
      } else if (response.status === 401) {
        window.location.href = "/admin/login";
      } else {
        setError("Failed to fetch subscriptions");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchSubscriptions(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchSubscriptions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleToggleStatus = async (subscription: NewsletterSubscription) => {
    const newStatus = subscription.status === "active" ? "unsubscribed" : "active";
    setUpdatingId(subscription.id);
    try {
      const response = await fetch(`/api/admin/newsletter/${subscription.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchSubscriptions();
      } else if (response.status === 401) {
        window.location.assign("/admin/login");
      } else {
        alert("Failed to update subscription");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscription? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchSubscriptions();
      } else if (response.status === 401) {
        window.location.href = "/admin/login";
      } else {
        alert("Failed to delete subscription");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    active: "status-active",
    unsubscribed: "status-unsubscribed",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="admin-newsletter">
        <div className="table-header">
          <h2 className="table-title">Newsletter Subscriptions</h2>
        </div>
        <div className="table-container">
          <table className="data-table">
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td><div className="placeholder-wave"><span className="placeholder col-6" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-4" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-4" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-6" /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-newsletter">
      <div className="table-header">
        <h2 className="table-title">Newsletter Subscriptions</h2>
        <div className="table-toolbar">
          <form onSubmit={handleSearch} className="search-box">
            <i className="fa-solid fa-search"></i>
            <input
              type="search"
              className="form-control"
              placeholder="Search email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search subscriptions"
            />
          </form>
          <select
            className="form-select filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger m-3" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-primary-light text-primary">
                <i className="fa-solid fa-bell"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Subscribers</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-success-light text-success">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats.active}</div>
                <div className="stat-label">Active</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="d-flex align-items-center">
              <div className="stat-icon bg-muted-light text-muted">
                <i className="fa-solid fa-user-slash"></i>
              </div>
              <div className="ms-3">
                <div className="stat-value">{stats.unsubscribed}</div>
                <div className="stat-label">Unsubscribed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        {subscriptions.length > 0 ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                    Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("source")} style={{ cursor: "pointer" }}>
                    Source {sortBy === "source" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                    Subscribed {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ width: "100px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div className="fw-medium">{sub.email}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${statusColors[sub.status] || ""}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">{sub.source}</span>
                    </td>
                    <td>{formatDate(sub.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary action-btn"
                          onClick={() => handleToggleStatus(sub)}
                          disabled={updatingId === sub.id}
                          title={sub.status === "active" ? "Unsubscribe" : "Reactivate"}
                        >
                          {updatingId === sub.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : sub.status === "active" ? (
                            <i className="fa-solid fa-user-slash"></i>
                          ) : (
                            <i className="fa-solid fa-user-check"></i>
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(sub.id)}
                          disabled={deletingId === sub.id}
                          title="Delete"
                        >
                          {deletingId === sub.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className="fa-solid fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <nav className="pagination" aria-label="Pagination">
                <a
                  className={`page-link${!pagination.hasPrev ? " disabled" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPrev) setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </a>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <a
                      key={pageNum}
                      className={`page-link${pagination.page === pageNum ? " active" : ""}`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPagination((prev) => ({ ...prev, page: pageNum }));
                      }}
                    >
                      {pageNum}
                    </a>
                  );
                })}
                <a
                  className={`page-link${!pagination.hasNext ? " disabled" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNext) setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </a>
              </nav>
            )}

            <div className="px-3 py-2 text-muted small border-top" style={{ borderColor: "#e9ecef" }}>
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} subscriptions
            </div>
          </>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-bell-slash"></i>
            <h4 className="mt-3">No subscriptions found</h4>
            <p className="mb-0">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
