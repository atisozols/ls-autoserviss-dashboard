"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === "/login") return null;

  const mode = searchParams.get("mode") ?? "monthly";
  const month = searchParams.get("month");
  const week = searchParams.get("week");
  let periodQuery = "";
  if (mode === "weekly" && week) periodQuery = `?mode=weekly&week=${week}`;
  else if (month) periodQuery = `?mode=monthly&month=${month}`;

  const isJobs = pathname === "/" || pathname.startsWith("/jobs");
  const isWorkers = pathname === "/workers";
  const isSettings = pathname === "/settings";

  return (
    <nav className="mobile-nav">
      <Link
        className={`mobile-nav-item ${isJobs ? "active" : ""}`}
        href={`/${periodQuery}`}
      >
        <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
          <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Darbi</span>
      </Link>

      <Link
        className={`mobile-nav-item ${isWorkers ? "active" : ""}`}
        href={`/workers${periodQuery}`}
      >
        <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Darbinieki</span>
      </Link>

      <Link
        className={`mobile-nav-item ${isSettings ? "active" : ""}`}
        href="/settings"
      >
        <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Iestatījumi</span>
      </Link>
    </nav>
  );
}
