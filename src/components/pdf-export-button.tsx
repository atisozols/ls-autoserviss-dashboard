"use client";

import { formatCurrency, formatDate } from "@/lib/calculations";

type PdfItem = {
  partName: string;
  partCode: string | null;
  notes: string | null;
  partSaleTotal: number;
  laborRevenue: number;
  lineRevenue: number;
};

type PdfExportButtonProps = {
  job: {
    plateNumber: string;
    clientName: string | null;
    date: Date;
  };
  items: PdfItem[];
  totalRevenue: number;
};

export function PdfExportButton({ job, items, totalRevenue }: PdfExportButtonProps) {
  function handleExport() {
    const rows = items
      .map((item) => {
        const desc = item.partName + (item.partCode ? ` (${item.partCode})` : "");
        const notes = item.notes ?? "";
        return `
          <tr>
            <td>
              <div class="desc">${desc}</div>
              ${notes ? `<div class="notes">${notes}</div>` : ""}
            </td>
            <td class="right">${item.partSaleTotal > 0 ? formatCurrency(item.partSaleTotal) : "—"}</td>
            <td class="right">${item.laborRevenue > 0 ? formatCurrency(item.laborRevenue) : "—"}</td>
            <td class="right bold">${formatCurrency(item.lineRevenue)}</td>
          </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="lv">
<head>
  <meta charset="UTF-8">
  <title>Darba karte — ${job.plateNumber}</title>
  <style>
    @media print { @page { margin: 14mm 14mm 14mm 14mm; size: A4; } }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      font-size: 12px;
      color: #111827;
      margin: 0;
      padding: 24px;
    }
    h1 { font-size: 22px; margin: 0 0 6px; letter-spacing: -0.02em; }
    .meta { color: #4b5563; font-size: 11.5px; line-height: 1.7; margin-bottom: 20px; }
    .meta strong { color: #111827; }
    table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    thead th {
      background: #111827;
      color: #fff;
      padding: 8px 10px;
      text-align: left;
      font-size: 11px;
      letter-spacing: 0.04em;
    }
    tbody td {
      padding: 7px 10px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }
    tbody tr:last-child td { border-bottom: 2px solid #d1d5db; }
    tfoot td {
      padding: 8px 10px;
      background: #f3f4f6;
      font-weight: 700;
    }
    .right { text-align: right; }
    .bold { font-weight: 600; }
    .desc { font-weight: 500; }
    .notes { color: #6b7280; font-size: 10.5px; margin-top: 2px; }
    .col-desc { width: auto; }
    .col-price { width: 90px; }
  </style>
</head>
<body>
  <h1>Darba karte</h1>
  <div class="meta">
    <div>Numurzīme: <strong>${job.plateNumber}</strong></div>
    ${job.clientName ? `<div>Klients: <strong>${job.clientName}</strong></div>` : ""}
    <div>Datums: ${formatDate(job.date)}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th class="col-desc">Apraksts</th>
        <th class="col-price right">Detaļas cena</th>
        <th class="col-price right">Darba cena</th>
        <th class="col-price right">Kopā</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td></td>
        <td></td>
        <td class="right">Kopā:</td>
        <td class="right">${formatCurrency(totalRevenue)}</td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  return (
    <button className="btn btn-secondary" onClick={handleExport} type="button">
      <svg fill="none" height="15" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="15">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      PDF
    </button>
  );
}
