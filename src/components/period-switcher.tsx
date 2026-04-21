"use client";

import { usePathname, useRouter } from "next/navigation";

import { getCurrentMonthStr, getCurrentWeekStart, getMonthBounds } from "@/lib/calculations";

type Props = {
  mode: "monthly" | "weekly";
  value: string; // "YYYY-MM" for monthly, "YYYY-MM-DD" (Monday) for weekly
  monthStartDay: number;
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

  if (monday.getUTCMonth() === friday.getUTCMonth()) {
    const dayFmt = new Intl.DateTimeFormat("lv-LV", { day: "numeric", timeZone: "UTC" });
    return `${dayFmt.format(monday)}. – ${fmt(friday)} ${monday.getUTCFullYear()}`;
  }

  return `${fmt(monday)} – ${fmt(friday)} ${friday.getUTCFullYear()}`;
}

function formatMonthLabel(monthKey: string, startDay: number): string {
  const { startDate, endDate } = getMonthBounds(monthKey, startDay);
  if (startDay === 1) {
    return startDate.toLocaleDateString("lv-LV", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  const last = new Date(endDate.getTime() - 86_400_000);
  const fmt = (date: Date) =>
    date.toLocaleDateString("lv-LV", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${fmt(startDate)} – ${fmt(last)} ${last.getUTCFullYear()}`;
}

export function PeriodSwitcher({ mode, value, monthStartDay }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function nav(params: string) {
    router.push(`${pathname}?${params}`);
  }

  function switchMode(newMode: "monthly" | "weekly") {
    if (newMode === "monthly") {
      nav(`mode=monthly&month=${getCurrentMonthStr(monthStartDay)}`);
    } else {
      nav(`mode=weekly&week=${getCurrentWeekStart()}`);
    }
  }

  function goMonth(delta: number) {
    const [year, mon] = value.split("-").map(Number);
    const d = new Date(year, mon - 1 + delta, 1);
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    nav(`mode=monthly&month=${next}`);
  }

  function goWeek(delta: number) {
    nav(`mode=weekly&week=${addWeeks(value, delta)}`);
  }

  const isAtLimit =
    (mode === "monthly" && value === getCurrentMonthStr(monthStartDay)) ||
    (mode === "weekly" && value === getCurrentWeekStart());

  const monthLabel = mode === "monthly" ? formatMonthLabel(value, monthStartDay) : "";

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
