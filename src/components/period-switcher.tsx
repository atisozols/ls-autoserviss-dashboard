"use client";

import { useRouter } from "next/navigation";

import { getCurrentMonthStr, getCurrentWeekStart } from "@/lib/calculations";

type Props = {
  mode: "monthly" | "weekly";
  value: string; // "YYYY-MM" for monthly, "YYYY-MM-DD" for weekly (Monday)
};

function addWeeks(weekStart: string, delta: number): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + delta * 7);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function formatWeekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const monday = new Date(Date.UTC(y, m - 1, d));
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);

  const fmt = (date: Date) =>
    date.toLocaleDateString("lv-LV", { day: "numeric", month: "short", timeZone: "UTC" });

  // If same month: "2. – 6. maijs 2025"
  if (monday.getUTCMonth() === friday.getUTCMonth()) {
    const dayFmt = new Intl.DateTimeFormat("lv-LV", { day: "numeric", timeZone: "UTC" });
    const monthYear = friday.toLocaleDateString("lv-LV", { month: "long", year: "numeric", timeZone: "UTC" });
    return `${dayFmt.format(monday)}. – ${fmt(friday)} ${monday.getUTCFullYear()}`;
  }

  // Cross-month: "28. apr – 2. maijs 2025"
  return `${fmt(monday)} – ${fmt(friday)} ${friday.getUTCFullYear()}`;
}

export function PeriodSwitcher({ mode, value }: Props) {
  const router = useRouter();

  function switchMode(newMode: "monthly" | "weekly") {
    if (newMode === "monthly") {
      router.push(`/?mode=monthly&month=${getCurrentMonthStr()}`);
    } else {
      router.push(`/?mode=weekly&week=${getCurrentWeekStart()}`);
    }
  }

  function goMonth(delta: number) {
    const [year, mon] = value.split("-").map(Number);
    const d = new Date(year, mon - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/?mode=monthly&month=${next}`);
  }

  function goWeek(delta: number) {
    const next = addWeeks(value, delta);
    router.push(`/?mode=weekly&week=${next}`);
  }

  const isCurrentMonth = mode === "monthly" && value === getCurrentMonthStr();
  const isCurrentWeek = mode === "weekly" && value === getCurrentWeekStart();
  const isAtLimit = isCurrentMonth || isCurrentWeek;

  const monthLabel =
    mode === "monthly"
      ? new Date(
          parseInt(value.split("-")[0]),
          parseInt(value.split("-")[1]) - 1,
          1,
        ).toLocaleDateString("lv-LV", { month: "long", year: "numeric" })
      : "";

  return (
    <div className="period-switcher">
      <div className="period-mode-toggle">
        <button
          className={`period-mode-btn${mode === "monthly" ? " active" : ""}`}
          onClick={() => switchMode("monthly")}
          type="button"
        >
          Mēnesis
        </button>
        <button
          className={`period-mode-btn${mode === "weekly" ? " active" : ""}`}
          onClick={() => switchMode("weekly")}
          type="button"
        >
          Nedēļa
        </button>
      </div>

      <div className="period-nav">
        <button
          className="month-btn"
          onClick={() => (mode === "monthly" ? goMonth(-1) : goWeek(-1))}
          title="Iepriekšējais"
          type="button"
        >
          ‹
        </button>
        <span className="month-label">
          {mode === "monthly" ? monthLabel : formatWeekLabel(value)}
        </span>
        <button
          className="month-btn"
          disabled={isAtLimit}
          onClick={() => (mode === "monthly" ? goMonth(1) : goWeek(1))}
          title="Nākamais"
          type="button"
        >
          ›
        </button>
      </div>
    </div>
  );
}
