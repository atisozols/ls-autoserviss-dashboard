"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/actions";

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link
          className={`sidebar-link ${pathname === "/" || pathname.startsWith("/jobs") ? "active" : ""}`}
          href="/"
        >
          <svg
            fill="none"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="18"
          >
            <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Darbi
        </Link>

        <Link
          className={`sidebar-link ${pathname === "/settings" ? "active" : ""}`}
          href="/settings"
        >
          <svg
            fill="none"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="18"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Iestatījumi
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <form action={logoutAction}>
          <button className="sidebar-link sidebar-logout" type="submit">
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Iziet
          </button>
        </form>
      </div>
    </aside>
  );
}
