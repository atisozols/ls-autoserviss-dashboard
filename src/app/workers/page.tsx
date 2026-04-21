import { PeriodSwitcher } from "@/components/period-switcher";
import { WorkersManager } from "@/components/workers-manager";
import {
  formatCurrency,
  getCurrentMonthStr,
  getCurrentWeekStart,
  getMonthBounds,
} from "@/lib/calculations";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type WorkersPageProps = {
  searchParams: Promise<{ month?: string; week?: string; mode?: string }>;
};

function getWeekBounds(weekStart: string): { startDate: Date; endDate: Date } {
  const [y, m, d] = weekStart.split("-").map(Number);
  const monday = new Date(Date.UTC(y, m - 1, d));
  const dow = monday.getUTCDay();
  const daysBack = dow === 0 ? 6 : dow - 1;
  monday.setUTCDate(monday.getUTCDate() - daysBack);
  const end = new Date(monday);
  end.setUTCDate(monday.getUTCDate() + 7);
  return { startDate: monday, endDate: end };
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

function formatMonthRangeLabel(startDate: Date, endDate: Date): string {
  const last = new Date(endDate.getTime() - 86_400_000);
  const fmt = (date: Date) =>
    date.toLocaleDateString("lv-LV", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${fmt(startDate)} – ${fmt(last)} ${last.getUTCFullYear()}`;
}

export default async function WorkersPage({ searchParams }: WorkersPageProps) {
  const params = await searchParams;
  const mode: "monthly" | "weekly" = params.mode === "weekly" ? "weekly" : "monthly";

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const monthStartDay = Number(settings?.monthStartDay ?? 10);

  let startDate: Date;
  let endDate: Date;
  let periodValue: string;
  let periodLabel: string;

  if (mode === "weekly") {
    periodValue = params.week ?? getCurrentWeekStart();
    const bounds = getWeekBounds(periodValue);
    startDate = bounds.startDate;
    endDate = bounds.endDate;
    periodValue = `${startDate.getUTCFullYear()}-${String(startDate.getUTCMonth() + 1).padStart(2, "0")}-${String(startDate.getUTCDate()).padStart(2, "0")}`;
    periodLabel = formatWeekLabel(periodValue);
  } else {
    periodValue = params.month ?? getCurrentMonthStr(monthStartDay);
    const bounds = getMonthBounds(periodValue, monthStartDay);
    startDate = bounds.startDate;
    endDate = bounds.endDate;
    periodLabel = formatMonthRangeLabel(startDate, endDate);
  }

  const [workers, jobsInPeriod] = await Promise.all([
    prisma.worker.findMany({ orderBy: { name: "asc" } }),
    prisma.job.findMany({
      where: {
        date: { gte: startDate, lt: endDate },
        workerId: { not: null },
      },
      select: {
        workerId: true,
        items: {
          select: { laborHours: true, employeeHourlyCost: true },
        },
      },
    }),
  ]);

  // Aggregate hours per worker for the period (pay is informational at 8 €/h)
  const DISPLAY_HOURLY_RATE = 8;
  const stats = new Map<string, { hours: number }>();
  for (const job of jobsInPeriod) {
    if (!job.workerId) continue;
    const s = stats.get(job.workerId) ?? { hours: 0 };
    for (const item of job.items) {
      s.hours += Number(item.laborHours);
    }
    stats.set(job.workerId, s);
  }

  const workerRows = workers.map((w) => {
    const s = stats.get(w.id) ?? { hours: 0 };
    const hours = Math.round(s.hours * 100) / 100;
    return {
      id: w.id,
      name: w.name,
      monthlyRate: Number(w.monthlyRate),
      periodHours: hours,
      periodPay: Math.round(hours * DISPLAY_HOURLY_RATE * 100) / 100,
    };
  });

  // Summary totals for the period
  const totalHours = workerRows.reduce((s, w) => s + w.periodHours, 0);
  const totalPay = workerRows.reduce((s, w) => s + w.periodPay, 0);

  return (
    <div className="shell">
      <div className="page-header">
        <h1>Darbinieki</h1>
        <div className="page-header-right">
          <PeriodSwitcher mode={mode} monthStartDay={monthStartDay} value={periodValue} />
        </div>
      </div>

      {workers.length > 0 && (
        <section className="stats-grid stats-grid-2">
          <article className="metric-card">
            <span>Kopējās stundas</span>
            <strong>{totalHours > 0 ? `${totalHours.toFixed(2)} h` : "—"}</strong>
          </article>
          <article className="metric-card">
            <span>Kopējās algas izmaksas</span>
            <strong>{totalPay > 0 ? formatCurrency(totalPay) : "—"}</strong>
          </article>
        </section>
      )}

      <WorkersManager periodLabel={periodLabel} workers={workerRows} />
    </div>
  );
}
