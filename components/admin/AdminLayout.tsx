"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: "fa-gauge-high" },
  { href: "/admin/contacts", label: "Contact Submissions", icon: "fa-envelope" },
  { href: "/admin/bookings", label: "Bookings", icon: "fa-calendar-check" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "fa-bell" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-layout">
      <aside
        className={`admin-sidebar${sidebarOpen ? " open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="sidebar-header">
          <Link href="/admin" className="sidebar-brand">
            <i className="fa-solid fa-sparkles me-2"></i>
            <span>SparkleClean Admin</span>
          </Link>
          <button
            className="sidebar-close d-lg-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav flex-column">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link${pathname === item.href || pathname.startsWith(item.href + "/") ? " active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`fa-solid ${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="btn btn-outline-danger w-100 mt-2" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button
            className="sidebar-toggle d-lg-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <h1 className="admin-title">
            {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label || "Dashboard"}
          </h1>
          <div className="header-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
              <i className="fa-solid fa-external-link-alt me-1"></i> View Site
            </a>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>

      <div
        className={`sidebar-overlay${sidebarOpen ? " show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    </div>
  );
}
