import type { Metadata } from "next";
import { Suspense } from "react";

import { LayoutClient } from "@/components/layout-client";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "LS Autoserviss",
  description: "Autoservisa darbu un peļņas uzskaite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lv">
      <body>
        <div className="app-layout">
          <Suspense>
            <Sidebar />
          </Suspense>
          <div className="main-content">
            <LayoutClient>{children}</LayoutClient>
          </div>
        </div>
        <Suspense>
          <MobileNav />
        </Suspense>
      </body>
    </html>
  );
}
