"use client";

import { useRouter } from "next/navigation";

import { getCurrentMonthStr } from "@/lib/calculations";

export function MonthSwitcher({ currentMonth }: { currentMonth: string }) {
  const router = useRouter();
  const [year, mon] = currentMonth.split("-").map(Number);

  function go(delta: number) {
    const d = new Date(year, mon - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/?month=${next}`);
  }

  const label = new Date(year, mon - 1, 1).toLocaleDateString("lv-LV", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth = currentMonth === getCurrentMonthStr();

  return (
    <div className="month-switcher">
      <button className="month-btn" onClick={() => go(-1)} title="Iepriekšējais mēnesis" type="button">
        ‹
      </button>
      <span className="month-label">{label}</span>
      <button
        className="month-btn"
        disabled={isCurrentMonth}
        onClick={() => go(1)}
        title="Nākamais mēnesis"
        type="button"
      >
        ›
      </button>
    </div>
  );
}
