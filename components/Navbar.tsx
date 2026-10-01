"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dataRaw from "@/data/data.json";
import type { NavigationData, SiteData } from "@/data/types";

const navigation = dataRaw.navigation as NavigationData;
const site = dataRaw.site as SiteData;

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [sticky, setSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollTop = useRef(0);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const isWide = pathname === "/testimonials" || pathname === "/contact";

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      const st = window.scrollY;
      if (st > 80) {
        setSticky(true);
      } else {
        setSticky(false);
      }
      lastScrollTop.current = st;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (open && navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const brandInner = (
    <>
      <span className="brand-logo">
        <i className={site.brandIcon}></i>
      </span>
      <span className="brand-text">
        {site.brandPrefix}
        <span className="spark">{site.brandAccent}</span>
      </span>
    </>
  );

  return (
    <nav
      id="navbar"
      ref={navRef}
      className={`navbar navbar-expand-lg${sticky ? " navbar-sticky" : ""}${isWide ? " px-3 px-lg-5" : ""}`}
    >
      <div className={isWide ? "container-fluid" : "container"}>
        <Link href="/" className="navbar-brand" onClick={closeMenu} prefetch={false}>
          {isWide ? <h2 className="mb-0">{brandInner}</h2> : brandInner}
        </Link>
        <button
          type="button"
          className={`navbar-toggler${open ? " collapsed" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarSupportedContent" className={`collapse navbar-collapse${open ? " show" : ""}`}>
          <div className="navbar-nav mx-auto">
            {navigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                prefetch={false}
                className={`nav-item nav-link${pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="d-flex ms-lg-3">
            <Link
              href={navigation.cta.href}
              onClick={closeMenu}
              prefetch={false}
              className={`btn ${isWide ? "btn-primary" : "btn-accent btn-sm px-4"}`}
            >
              <i className={navigation.cta.icon}></i> {navigation.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
