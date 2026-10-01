"use client";

import { useEffect, useState, useCallback } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  serviceType: string | null;
  message: string;
  variant: string;
  status: string;
  notes: string | null;
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

interface ContactsResponse {
  success: boolean;
  data: Contact[];
  pagination: Pagination;
  stats: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    spam: number;
    today: number;
  };
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [stats, setStats] = useState<ContactsResponse["stats"]>({
    total: 0, new: 0, inProgress: 0, resolved: 0, spam: 0, today: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchContacts = useCallback(async () => {
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

      const response = await fetch(`/api/admin/contacts?${params}`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setContacts(data.data);
          setPagination(data.pagination);
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to fetch contacts");
        }
      } else if (response.status === 401) {
        window.location.href = "/admin/login";
      } else {
        setError("Failed to fetch contacts");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchContacts(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchContacts]);

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

  const handleViewDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditForm({
      status: contact.status,
      notes: contact.notes || "",
      name: contact.name,
      email: contact.email,
      phone: contact.phone || "",
      serviceType: contact.serviceType || "",
      message: contact.message,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingContact) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/contacts/${editingContact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShowEditModal(false);
          setEditingContact(null);
          fetchContacts();
        } else {
          alert(data.message || "Failed to update contact");
        }
      } else if (response.status === 401) {
        window.location.href = "/admin/login";
      } else {
        alert("Failed to update contact");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchContacts();
      } else if (response.status === 401) {
        window.location.href = "/admin/login";
      } else {
        alert("Failed to delete contact");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    new: "status-new",
    in_progress: "status-in_progress",
    resolved: "status-resolved",
    spam: "status-spam",
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

  if (loading && contacts.length === 0) {
    return (
      <div className="admin-contacts">
        <div className="table-header">
          <h2 className="table-title">Contact Submissions</h2>
        </div>
        <div className="table-container">
          <table className="data-table">
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td><div className="placeholder-wave"><span className="placeholder col-6" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-8" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-4" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-6" /></div></td>
                  <td><div className="placeholder-wave"><span className="placeholder col-4" /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contacts">
      <div className="table-header">
        <h2 className="table-title">Contact Submissions</h2>
        <div className="table-toolbar">
          <form onSubmit={handleSearch} className="search-box">
            <i className="fa-solid fa-search"></i>
            <input
              type="search"
              className="form-control"
              placeholder="Search name, email, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search contacts"
            />
          </form>
          <select
            className="form-select filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger m-3" role="alert">
          {error}
        </div>
      )}

      <div className="table-container">
        {contacts.length > 0 ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                    Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("serviceType")} style={{ cursor: "pointer" }}>
                    Service {sortBy === "serviceType" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                    Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                    Date {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ width: "100px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <div>
                        <div className="fw-medium">{contact.name}</div>
                        {contact.phone && <small className="text-muted">{contact.phone}</small>}
                      </div>
                    </td>
                    <td>{contact.email}</td>
                    <td>
                      {contact.serviceType ? (
                        <span className="badge bg-light text-dark">{contact.serviceType}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${statusColors[contact.status] || ""}`}>
                        {contact.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{formatDate(contact.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary action-btn"
                          onClick={() => handleViewDetail(contact)}
                          title="View Details"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary action-btn"
                          onClick={() => handleEdit(contact)}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(contact.id)}
                          disabled={deletingId === contact.id}
                          title="Delete"
                        >
                          {deletingId === contact.id ? (
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
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} contacts
            </div>
          </>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-envelope-open"></i>
            <h4 className="mt-3">No contacts found</h4>
            <p className="mb-0">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {showDetailModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Contact Details</h3>
              <button className="modal-close" onClick={() => setShowDetailModal(false)} aria-label="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedContact.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedContact.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedContact.phone || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Service Type:</span>
                <span className="detail-value">{selectedContact.serviceType || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <span className={`status-badge ${statusColors[selectedContact.status] || ""}`}>
                    {selectedContact.status.replace("_", " ")}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Submitted:</span>
                <span className="detail-value">{formatDate(selectedContact.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Variant:</span>
                <span className="detail-value">{selectedContact.variant}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Message:</span>
                <span className="detail-value"><pre>{selectedContact.message}</pre></span>
              </div>
              {selectedContact.notes && (
                <div className="detail-row">
                  <span className="detail-label">Admin Notes:</span>
                  <span className="detail-value"><pre>{selectedContact.notes}</pre></span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { handleEdit(selectedContact); setShowDetailModal(false); }}>
                <i className="fa-solid fa-pen me-1"></i> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingContact && (
        <div className="modal-overlay" onClick={() => { setShowEditModal(false); setEditingContact(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Contact</h3>
              <button className="modal-close" onClick={() => { setShowEditModal(false); setEditingContact(null); }} aria-label="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Service Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.serviceType || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, serviceType: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={editForm.status}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={editForm.message || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Admin Notes</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={editForm.notes || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowEditModal(false); setEditingContact(null); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit} disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
