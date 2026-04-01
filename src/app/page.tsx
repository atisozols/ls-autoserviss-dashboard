import { NewJobModal } from "@/components/new-job-modal";
import { PeriodSwitcher } from "@/components/period-switcher";
import { JobsSearch } from "@/components/jobs-search";
import {
  calculateJobTotals,
  formatCurrency,
  formatDate,
  getCurrentMonthStr,
  getCurrentWeekStart,
  calculatePeriodFixedCosts,
  toInputDate,
} from "@/lib/calculations";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ month?: string; week?: string; mode?: string }>;
};

function getWeekBounds(weekStart: string): { startDate: Date; endDate: Date } {
  const [y, m, d] = weekStart.split("-").map(Number);
  const monday = new Date(Date.UTC(y, m - 1, d));
  // Ensure it really is Monday (guard against bad params)
  const dow = monday.getUTCDay();
  const daysBack = dow === 0 ? 6 : dow - 1;
  monday.setUTCDate(monday.getUTCDate() - daysBack);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 7); // exclusive end

  return { startDate: monday, endDate: sunday };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const mode: "monthly" | "weekly" = params.mode === "weekly" ? "weekly" : "monthly";

  // Today at UTC midnight for fixed-cost cutoff
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  let startDate: Date;
  let endDate: Date;
  let periodValue: string; // "YYYY-MM" or "YYYY-MM-DD"

  if (mode === "weekly") {
    periodValue = params.week ?? getCurrentWeekStart();
    const bounds = getWeekBounds(periodValue);
    startDate = bounds.startDate;
    endDate = bounds.endDate;
    // Normalise periodValue to the actual Monday
    periodValue = `${startDate.getUTCFullYear()}-${String(startDate.getUTCMonth() + 1).padStart(2, "0")}-${String(startDate.getUTCDate()).padStart(2, "0")}`;
  } else {
    periodValue = params.month ?? getCurrentMonthStr();
    const [yearStr, monStr] = periodValue.split("-");
    const year = parseInt(yearStr, 10);
    const mon = parseInt(monStr, 10);
    startDate = new Date(Date.UTC(year, mon - 1, 1));
    endDate = new Date(Date.UTC(year, mon, 1));
  }

  const [jobs, settings] = await Promise.all([
    prisma.job.findMany({
      where: { date: { gte: startDate, lt: endDate } },
      include: { items: { orderBy: { rowOrder: "asc" } } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  const totalMonthlyFixed = settings
    ? Number(settings.electricityCost) +
      Number(settings.rentCost) +
      Number(settings.heatCost) +
      Number(settings.cleaningCost) +
      Number(settings.clothingCost)
    : 0;

  const { effectiveCost: periodFixedCost, businessDaysElapsed } = calculatePeriodFixedCosts(
    totalMonthlyFixed,
    startDate,
    endDate,
    todayUTC,
  );

  const jobsWithTotals = jobs.map((job) => {
    const totals = calculateJobTotals(job);
    const amountPaid = Number(job.amountPaid ?? 0);
    const awaitingPayment = Math.max(0, Math.round((totals.totalRevenue - amountPaid) * 100) / 100);
    return { ...job, totals, amountPaid, awaitingPayment };
  });

  const periodRevenue = jobsWithTotals.reduce((s, j) => s + j.totals.totalRevenue, 0);
  const periodJobCosts = jobsWithTotals.reduce((s, j) => s + j.totals.totalCost, 0);
  const periodTotalCost = Math.round((periodJobCosts + periodFixedCost) * 100) / 100;
  const periodProfit = Math.round((periodRevenue - periodTotalCost) * 100) / 100;
  const periodAwaiting = jobsWithTotals.reduce((s, j) => s + j.awaitingPayment, 0);

  const jobRows = jobsWithTotals.map((j) => ({
    id: j.id,
    date: formatDate(j.date),
    plateNumber: j.plateNumber,
    clientName: j.clientName,
    clientPhone: j.clientPhone,
    positionCount: j.totals.positionCount,
    totalCost: formatCurrency(j.totals.totalCost),
    totalRevenue: formatCurrency(j.totals.totalRevenue),
    profit: formatCurrency(j.totals.profit),
    profitGood: j.totals.profit >= 0,
    awaitingPayment: j.awaitingPayment > 0 ? formatCurrency(j.awaitingPayment) : null,
  }));

  return (
    <div className="shell">
      <div className="page-header">
        <h1>Darbi</h1>
        <div className="page-header-right">
          <PeriodSwitcher mode={mode} value={periodValue} />
          <NewJobModal defaultDate={toInputDate(new Date())} />
        </div>
      </div>

      <section className="stats-grid stats-grid-4">
        <article className="metric-card">
          <span>Ienākumi</span>
          <strong>{formatCurrency(periodRevenue)}</strong>
        </article>
        <article className="metric-card">
          <span>Izmaksas</span>
          <strong>{formatCurrency(periodTotalCost)}</strong>
          {periodFixedCost > 0 && (
            <small className="metric-note">
              t.sk. {formatCurrency(periodFixedCost)} fiksētās ({businessDaysElapsed} d.)
            </small>
          )}
        </article>
        <article className={`metric-card ${periodProfit >= 0 ? "profit-good" : "profit-bad"}`}>
          <span>Peļņa</span>
          <strong>{formatCurrency(periodProfit)}</strong>
        </article>
        <article className={`metric-card ${periodAwaiting > 0 ? "awaiting-highlight" : "profit-good"}`}>
          <span>Gaida apmaksu</span>
          <strong>{formatCurrency(periodAwaiting)}</strong>
        </article>
      </section>

      {totalMonthlyFixed > 0 && (
        <p className="overhead-note">
          Fiksētās izmaksas {formatCurrency(totalMonthlyFixed)}/mēn · uzkrāts par {businessDaysElapsed} darba dienām ·{" "}
          {formatCurrency(periodFixedCost)} šajā periodā
        </p>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h2>Darbi</h2>
          <span className="pill">{jobs.length} ieraksti</span>
        </div>

        <JobsSearch jobs={jobRows} />
      </section>
    </div>
  );
}
