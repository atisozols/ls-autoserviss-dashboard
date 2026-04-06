"use client";

import { useState } from "react";

import { createWorkerAction, deleteWorkerAction, updateWorkerAction } from "@/app/actions";

export type WorkerRow = {
  id: string;
  name: string;
  hourlyRate: number;
  periodHours: number;
  periodPay: number;
};

type Props = {
  workers: WorkerRow[];
  periodLabel: string;
};

export function WorkersManager({ workers, periodLabel }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRate, setEditRate] = useState("");

  function startEdit(w: WorkerRow) {
    setEditingId(w.id);
    setEditName(w.name);
    setEditRate(String(w.hourlyRate));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <div className="workers-layout">
      {/* Period stats */}
      <section className="panel">
        <div className="panel-heading">
          <h2>Stundas un algas — {periodLabel}</h2>
          <span className="pill">{workers.length} darbinieki</span>
        </div>

        {workers.length === 0 ? (
          <div className="empty-state">
            <h3>Nav pievienotu darbinieku</h3>
            <p>Pievieno darbiniekus zemāk, lai sekotu to stundām un izmaksām.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Darbinieks</th>
                  <th>Likme (€/h)</th>
                  <th>Stundas periodā</th>
                  <th>Izmaksas periodā</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id}>
                    <td><strong>{w.name}</strong></td>
                    <td>{w.hourlyRate.toFixed(2)} €/h</td>
                    <td>{w.periodHours > 0 ? w.periodHours.toFixed(2) : "—"}</td>
                    <td>{w.periodPay > 0 ? `${w.periodPay.toFixed(2)} €` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CRUD */}
      <section className="panel">
        <div className="panel-heading">
          <h2>Pārvaldīt darbiniekus</h2>
        </div>

        <div className="workers-list">
          {workers.map((w) =>
            editingId === w.id ? (
              <form
                key={w.id}
                action={async (fd) => {
                  fd.append("id", w.id);
                  await updateWorkerAction(fd);
                  setEditingId(null);
                }}
                className="worker-edit-row"
              >
                <input
                  className="worker-name-input"
                  name="name"
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Vārds"
                  required
                  type="text"
                  value={editName}
                />
                <div className="worker-rate-field">
                  <input
                    className="worker-rate-input"
                    min="0"
                    name="hourlyRate"
                    onChange={(e) => setEditRate(e.target.value)}
                    step="0.01"
                    type="number"
                    value={editRate}
                  />
                  <span className="worker-rate-unit">€/h</span>
                </div>
                <div className="worker-row-actions">
                  <button className="btn btn-secondary btn-sm" type="submit">Saglabāt</button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit} type="button">Atcelt</button>
                </div>
              </form>
            ) : (
              <div className="worker-row" key={w.id}>
                <span className="worker-row-name">{w.name}</span>
                <span className="worker-row-rate">{w.hourlyRate.toFixed(2)} €/h</span>
                <div className="worker-row-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => startEdit(w)}
                    type="button"
                  >
                    Labot
                  </button>
                  <form
                    action={deleteWorkerAction}
                    onSubmit={(e) => {
                      if (!confirm(`Dzēst darbinieku "${w.name}"? Darbi saglabāsies.`)) {
                        e.preventDefault();
                      }
                    }}
                    style={{ display: "inline" }}
                  >
                    <input name="id" type="hidden" value={w.id} />
                    <button className="btn btn-ghost btn-sm" type="submit">Dzēst</button>
                  </form>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Add new worker */}
        <form action={createWorkerAction} className="worker-add-form">
          <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>Pievienot darbinieku</p>
          <div className="worker-add-row">
            <input
              className="worker-name-input"
              name="name"
              placeholder="Vārds Uzvārds"
              required
              type="text"
            />
            <div className="worker-rate-field">
              <input
                className="worker-rate-input"
                defaultValue="8"
                min="0"
                name="hourlyRate"
                step="0.01"
                type="number"
              />
              <span className="worker-rate-unit">€/h</span>
            </div>
            <button className="btn btn-primary btn-sm" type="submit">Pievienot +</button>
          </div>
        </form>
      </section>
    </div>
  );
}
