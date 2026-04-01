"use client";

import { useState } from "react";

import { updateJobPaymentAction } from "@/app/actions";
import { formatCurrency } from "@/lib/calculations";

type PaymentSectionProps = {
  jobId: string;
  totalRevenue: number;
  amountPaid: number;
};

export function PaymentSection({ jobId, totalRevenue, amountPaid: initial }: PaymentSectionProps) {
  const [paid, setPaid] = useState(initial);
  const [input, setInput] = useState(initial > 0 ? String(initial) : "");
  const [saving, setSaving] = useState(false);

  const awaiting = Math.max(0, Math.round((totalRevenue - paid) * 100) / 100);
  const fullyPaid = totalRevenue > 0 && awaiting === 0;
  const paidPercent = totalRevenue > 0 ? Math.min(100, Math.round((paid / totalRevenue) * 100)) : 0;

  async function save(amount: number) {
    setSaving(true);
    const clamped = Math.min(Math.max(amount, 0), totalRevenue);
    const fd = new FormData();
    fd.append("jobId", jobId);
    fd.append("amountPaid", String(clamped));
    await updateJobPaymentAction(fd);
    setPaid(clamped);
    setInput(clamped > 0 ? String(clamped) : "");
    setSaving(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save(Number(input) || 0);
  }

  return (
    <div className="payment-block">
      {/* Progress bar */}
      <div className="payment-bar-wrap">
        <div className="payment-bar">
          <div
            className={`payment-bar-fill ${fullyPaid ? "payment-bar-full" : ""}`}
            style={{ width: `${paidPercent}%` }}
          />
        </div>
        <span className="payment-bar-label">{paidPercent}%</span>
      </div>

      {/* Amounts row */}
      <div className="payment-amounts">
        <div>
          <span className="payment-label">Apmaksāts</span>
          <span className={`payment-value ${fullyPaid ? "payment-value-good" : ""}`}>
            {formatCurrency(paid)}
          </span>
        </div>
        <div className="payment-amounts-sep">no</div>
        <div>
          <span className="payment-label">Kopā</span>
          <span className="payment-value">{formatCurrency(totalRevenue)}</span>
        </div>
        {!fullyPaid && awaiting > 0 && (
          <>
            <div className="payment-amounts-sep">·</div>
            <div>
              <span className="payment-label">Atlicis</span>
              <span className="payment-value payment-value-await">{formatCurrency(awaiting)}</span>
            </div>
          </>
        )}
      </div>

      {/* Action row */}
      {fullyPaid ? (
        <div className="payment-done-row">
          <span className="paid-badge">✓ Pilnībā apmaksāts</span>
          <button
            className="btn-text"
            onClick={() => { setPaid(0); setInput(""); save(0); }}
            type="button"
          >
            Atcelt
          </button>
        </div>
      ) : (
        <form className="payment-input-row" onSubmit={handleSubmit}>
          <input
            className="payment-input"
            max={totalRevenue}
            min={0}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={input}
          />
          <button className="btn btn-secondary" disabled={saving} type="submit">
            {saving ? <span className="btn-spinner" /> : "Saglabāt"}
          </button>
          <button
            className="btn btn-primary"
            disabled={saving}
            onClick={() => save(totalRevenue)}
            type="button"
          >
            Apmaksāts ✓
          </button>
        </form>
      )}
    </div>
  );
}
