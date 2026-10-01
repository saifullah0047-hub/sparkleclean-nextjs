import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "accent" | "outline-primary" | "outline-light" | "light";
  size?: "sm" | "lg";
  className?: string;
  children: ReactNode;
};

export default function Button({
  href,
  variant = "primary",
  size,
  className = "",
  children,
}: ButtonProps) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!href) {
    return (
      <button type="button" className={classes}>
        {children}
      </button>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} prefetch={false}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}