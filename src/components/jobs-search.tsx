"use client";

import { useState } from "react";
import Link from "next/link";

export type JobRow = {
  id: string;
  date: string; // pre-formatted "DD.MM.YYYY"
  plateNumber: string;
  clientName: string | null;
  clientPhone: string | null;
  positionCount: number;
  totalCost: string; // pre-formatted currency
  totalRevenue: string;
  profit: string;
  profitGood: boolean;
  awaitingPayment: string | null; // null means fully paid
};

type Props = {
  jobs: JobRow[];
};

export function JobsSearch({ jobs }: Props) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? jobs.filter(
        (j) =>
          j.plateNumber.toLowerCase().includes(q) ||
          (j.clientName ?? "").toLowerCase().includes(q) ||
          (j.clientPhone ?? "").toLowerCase().includes(q),
      )
    : jobs;

  return (
    <>
      <div className="jobs-search-wrap">
        <svg className="search-icon" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="jobs-search-input"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Meklēt pēc klienta, telefona, numurzīmes…"
          type="text"
          value={query}
        />
        {query && (
          <button className="search-clear-btn" onClick={() => setQuery("")} type="button">
            ×
          </button>
        )}
      </div>

      {visible.length === 0 && jobs.length === 0 ? (
        <div className="empty-state">
          <h3>Šajā periodā vēl nav darbu</h3>
          <p>
            Spied <strong>Jauns darbs +</strong>, izveido galveni un pēc tam pievieno darba
            pozīcijas detalizētajā skatā.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <h3>Nekas netika atrasts</h3>
          <p>Mēģini citu meklēšanas vārdu.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Datums</th>
                <th>Numurzīme</th>
                <th>Klients</th>
                <th>Poz.</th>
                <th>Izmaksas</th>
                <th>Ienākumi</th>
                <th>Peļņa</th>
                <th>Gaida</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((job) => (
                <tr key={job.id}>
                  <td>{job.date}</td>
                  <td>
                    <strong>{job.plateNumber}</strong>
                  </td>
                  <td>
                    {job.clientPhone ? (
                      <a className="phone-link" href={`tel:${job.clientPhone}`}>
                        {job.clientName || job.clientPhone}
                      </a>
                    ) : (
                      job.clientName || "—"
                    )}
                  </td>
                  <td>{job.positionCount}</td>
                  <td>{job.totalCost}</td>
                  <td>{job.totalRevenue}</td>
                  <td className={job.profitGood ? "profit-good" : "profit-bad"}>{job.profit}</td>
                  <td className={job.awaitingPayment ? "awaiting-cell" : "paid-cell"}>
                    {job.awaitingPayment ?? "✓"}
                  </td>
                  <td>
                    <Link className="table-link" href={`/jobs/${job.id}`}>
                      Atvērt →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
