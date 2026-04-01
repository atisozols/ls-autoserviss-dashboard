import Link from "next/link";
import { notFound } from "next/navigation";

import { updateJobAction } from "@/app/actions";
import { DeleteJobButton } from "@/components/delete-job-button";
import { JobItemsTable } from "@/components/job-items-table";
import { PaymentSection } from "@/components/payment-section";
import { PdfExportButton } from "@/components/pdf-export-button";
import {
  calculateJobItem,
  calculateJobTotals,
  formatCurrency,
  formatDate,
  calculatePeriodFixedCosts,
  toInputDate,
} from "@/lib/calculations";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type JobPageProps = {
  params: Promise<{ id: string }>;
};

const defaultSettings = { laborRate: 35, employeeHourlyCost: 8 };

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;

  const [job, settings] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: { items: { orderBy: { rowOrder: "asc" } } },
    }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  if (!job) notFound();

  const totals = calculateJobTotals(job);
  const s = settings ?? defaultSettings;
  const amountPaid = Number(job.amountPaid ?? 0);
  const awaitingPayment = Math.max(0, Math.round((totals.totalRevenue - amountPaid) * 100) / 100);

  // Per-job overhead allocation
  const totalMonthlyFixed = settings
    ? Number(settings.electricityCost) +
      Number(settings.rentCost) +
      Number(settings.heatCost) +
      Number(settings.cleaningCost) +
      Number(settings.clothingCost)
    : 0;

  const jobDateKey = job.date.toISOString().slice(0, 10);

  const jobsOnSameDay = await prisma.job.count({
    where: {
      date: {
        gte: new Date(`${jobDateKey}T00:00:00.000Z`),
        lt: new Date(new Date(`${jobDateKey}T00:00:00.000Z`).getTime() + 86_400_000),
      },
    },
  });

  // Fixed cost per day: use the same "up to today" logic as the dashboard.
  // For the job's specific day we just need the daily rate = monthlyFixed / businessDaysInMonth.
  // We calculate one day's worth via calculatePeriodFixedCosts over [jobDay, jobDay+1).
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const jobDayStart = new Date(`${jobDateKey}T00:00:00.000Z`);
  const jobDayEnd = new Date(jobDayStart.getTime() + 86_400_000);

  const { effectiveCost: jobDayCost } = calculatePeriodFixedCosts(
    totalMonthlyFixed,
    jobDayStart,
    jobDayEnd,
    todayUTC,
  );

  const jobOverhead =
    totalMonthlyFixed > 0
      ? Math.round((jobDayCost / Math.max(jobsOnSameDay, 1)) * 100) / 100
      : 0;

  const adjustedCost = Math.round((totals.totalCost + jobOverhead) * 100) / 100;
  const adjustedProfit = Math.round((totals.totalRevenue - adjustedCost) * 100) / 100;

  const serializedItems = job.items.map((item) => ({
    id: item.id,
    partName: item.partName,
    partCode: item.partCode,
    quantity: item.quantity.toString(),
    partPurchasePrice: item.partPurchasePrice.toString(),
    partSalePrice: item.partSalePrice.toString(),
    laborHours: item.laborHours.toString(),
    laborRate: item.laborRate.toString(),
    employeeHourlyCost: item.employeeHourlyCost.toString(),
    notes: item.notes,
  }));

  const pdfItems = job.items.map((item) => {
    const calc = calculateJobItem({
      quantity: Number(item.quantity),
      partPurchasePrice: Number(item.partPurchasePrice),
      partSalePrice: Number(item.partSalePrice),
      laborHours: Number(item.laborHours),
      laborRate: Number(item.laborRate),
      employeeHourlyCost: Number(item.employeeHourlyCost),
    });
    return {
      partName: item.partName,
      partCode: item.partCode,
      notes: item.notes,
      partSaleTotal: calc.partSaleTotal,
      laborRevenue: calc.laborRevenue,
      lineRevenue: calc.lineRevenue,
    };
  });

  return (
    <div className="shell">
      <div className="job-detail-header">
        <div>
          <Link className="back-link" href="/">
            ← Atpakaļ
          </Link>
          <p className="eyebrow">Darba karte</p>
          <h1>
            {job.plateNumber}
            {job.clientName ? ` · ${job.clientName}` : ""}
          </h1>
          <div className="job-meta-row">
            <span className="hero-text">{formatDate(job.date)}</span>
            {job.clientPhone && (
              <a className="phone-link phone-link-lg" href={`tel:${job.clientPhone}`}>
                <svg fill="none" height="13" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {job.clientPhone}
              </a>
            )}
            {job.vehicleNote && <span className="hero-text">· {job.vehicleNote}</span>}
          </div>
        </div>
        <div className="job-header-actions">
          <PdfExportButton
            items={pdfItems}
            job={{ plateNumber: job.plateNumber, clientName: job.clientName, date: job.date }}
            totalRevenue={totals.totalRevenue}
          />
          <DeleteJobButton jobId={job.id} />
        </div>
      </div>

      <section className="stats-grid stats-grid-4">
        <article className="metric-card">
          <span>Ienākumi</span>
          <strong>{formatCurrency(totals.totalRevenue)}</strong>
        </article>
        <article className="metric-card">
          <span>Izmaksas</span>
          <strong>{formatCurrency(adjustedCost)}</strong>
          {jobOverhead > 0 && (
            <small className="metric-note">t.sk. {formatCurrency(jobOverhead)} fiksētās</small>
          )}
        </article>
        <article className={`metric-card ${adjustedProfit >= 0 ? "profit-good" : "profit-bad"}`}>
          <span>Peļņa</span>
          <strong>{formatCurrency(adjustedProfit)}</strong>
        </article>
        <article className={`metric-card ${awaitingPayment > 0 ? "awaiting-highlight" : "profit-good"}`}>
          <span>Gaida apmaksu</span>
          <strong>{formatCurrency(awaitingPayment)}</strong>
        </article>
      </section>

      <div className="detail-columns">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Darba galvene</p>
              <h2>Pamatinformācija</h2>
            </div>
          </div>

          <form action={updateJobAction} className="field-grid">
            <input name="jobId" type="hidden" value={job.id} />

            <label className="field">
              <span>Datums</span>
              <input defaultValue={toInputDate(job.date)} name="date" required type="date" />
            </label>

            <label className="field">
              <span>Numurzīme</span>
              <input defaultValue={job.plateNumber} name="plateNumber" required type="text" />
            </label>

            <label className="field">
              <span>Klienta vārds</span>
              <input defaultValue={job.clientName ?? ""} name="clientName" type="text" />
            </label>

            <label className="field">
              <span>
                Tel. numurs
                {job.clientPhone && (
                  <a className="phone-inline-link" href={`tel:${job.clientPhone}`}>
                    Zvanīt
                  </a>
                )}
              </span>
              <input defaultValue={job.clientPhone ?? ""} name="clientPhone" type="tel" />
            </label>

            <label className="field field-full">
              <span>Piezīmes</span>
              <textarea defaultValue={job.notes ?? ""} name="notes" rows={3} />
            </label>

            <div className="field-actions">
              <button className="btn btn-secondary" type="submit">
                Saglabāt galveni
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Apmaksa</p>
              <h2>Maksājumu statuss</h2>
            </div>
          </div>
          <PaymentSection
            amountPaid={amountPaid}
            jobId={job.id}
            totalRevenue={totals.totalRevenue}
          />
        </section>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Pozīcijas</p>
            <h2>Rindu aprēķini</h2>
          </div>
          <span className="pill">{totals.positionCount} rindas</span>
        </div>

        <JobItemsTable
          defaultEmployeeHourlyCost={Number(s.employeeHourlyCost)}
          defaultLaborRate={Number(s.laborRate)}
          initialItems={serializedItems}
          jobId={job.id}
        />
      </section>
    </div>
  );
}
