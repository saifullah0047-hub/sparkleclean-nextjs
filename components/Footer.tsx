"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import dataRaw from "@/data/data.json";
import type { FooterColumn, FooterData, FooterLink, SiteData } from "@/data/types";

const footer = dataRaw.footer as FooterData;
const site = dataRaw.site as SiteData;

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} prefetch={false}>
        {link.label}
      </Link>
    );
  }
  return <a href={link.href}>{link.label}</a>;
}

function ColumnList({ column, titleTag }: { column: FooterColumn; titleTag: "h4" | "h5" }) {
  const Title = titleTag;
  return (
    <>
      <Title>{column.title}</Title>
      {column.type === "newsletter" ? (
        <>
          <p style={{ fontSize: ".88rem" }}>{column.text}</p>
          <NewsletterForm placeholder={footer.newsletter.placeholder} variant="default" />
        </>
      ) : (
        <ul className="footer-links">
          {column.links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <FooterLinkItem link={link} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function BrandDefault() {
  return (
    <span className="brand-text">
      <span className="brand-logo">
        <i className={site.brandIcon}></i>
      </span>
      {site.brandPrefix}
      <span className="spark">{site.brandAccent}</span>
    </span>
  );
}

function Stars({ className = "rating-stars" }: { className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: site.rating.stars }).map((_, i) => (
        <i key={i} className="fa-solid fa-star"></i>
      ))}
    </div>
  );
}

function SocialLinks({ className = "footer-social" }: { className?: string }) {
  return (
    <div className={className}>
      {site.socials.map((social) => (
        <a key={social.label} href={social.href} aria-label={social.label}>
          <i className={social.icon}></i>
        </a>
      ))}
    </div>
  );
}

function FooterDefault() {
  const [company, services, support, newsletter] = footer.columns;
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <BrandDefault />
            <p className="footer-about">{footer.about}</p>
            <div className="rating-stars mt-3 mb-4">
              <Stars />
              <span className="ms-2" style={{ fontSize: ".85rem", color: "#93A5AD" }}>
                {footer.ratingLabel}
              </span>
            </div>
            <SocialLinks />
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <ColumnList column={company} titleTag="h5" />
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <ColumnList column={services} titleTag="h5" />
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <ColumnList column={support} titleTag="h5" />
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            <ColumnList column={newsletter} titleTag="h5" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="mb-0">
            &copy; {site.copyrightYear} {site.copyright}{" "}
            <span className="d-none d-sm-inline">|</span>{" "}
            <a href="#!" className="footer-legal">
              {site.license}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterWide() {
  const [company, services, support, newsletter] = footer.columns;
  const wideCompanyLinks = footer.companyLinksWide;
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link href="/" className="footer-brand">
              <span className="brand-logo">
                <i className={site.brandIcon}></i>
              </span>
              {site.brandPrefix}
              <span className="spark">{site.brandAccent}</span>
            </Link>
            <p className="text-muted">{footer.about}</p>
            <div className="rating-stars mt-3">
              <Stars />
              <span className="text-muted ms-2">{footer.ratingLabel}</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-3">
            <h4>{company.title}</h4>
            <ul className="footer-links">
              {wideCompanyLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <FooterLinkItem link={link} />
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-2 col-md-3">
            <ColumnList column={services} titleTag="h4" />
          </div>
          <div className="col-lg-2 col-md-3">
            <ColumnList column={support} titleTag="h4" />
          </div>
          <div className="col-lg-2 col-md-3">
            <h4>{newsletter.title}</h4>
            <p className="text-muted">{newsletter.type === "newsletter" ? newsletter.text : ""}</p>
            <NewsletterForm placeholder={footer.newsletter.placeholder} variant="wide" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="mb-0">
            &copy; {site.copyrightYear} {site.copyright} | {site.license}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isWide = pathname === "/testimonials" || pathname === "/contact";
  return isWide ? <FooterWide /> : <FooterDefault />;
}
