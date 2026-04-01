import { deleteJobItemAction, updateJobItemAction } from "@/app/actions";
import { calculateJobItem, formatCurrency } from "@/lib/calculations";

type JobItemEditorProps = {
  item: {
    id: string;
    partName: string;
    partCode: string | null;
    quantity: { toString(): string };
    partPurchasePrice: { toString(): string };
    partSalePrice: { toString(): string };
    laborHours: { toString(): string };
    laborRate: { toString(): string };
    employeeHourlyCost: { toString(): string };
    notes: string | null;
  };
  jobId: string;
};

export function JobItemEditor({ item, jobId }: JobItemEditorProps) {
  const calculations = calculateJobItem(item);

  return (
    <article className="item-card">
      <form action={updateJobItemAction} className="item-form">
        <input name="jobId" type="hidden" value={jobId} />
        <input name="itemId" type="hidden" value={item.id} />
        <input name="laborRate" type="hidden" value={item.laborRate.toString()} />
        <input
          name="employeeHourlyCost"
          type="hidden"
          value={item.employeeHourlyCost.toString()}
        />

        <div className="item-grid">
          <label className="field">
            <span>Detaļa / darbs</span>
            <input defaultValue={item.partName} name="partName" required type="text" />
          </label>

          <label className="field">
            <span>Kods</span>
            <input defaultValue={item.partCode ?? ""} name="partCode" type="text" />
          </label>

          <label className="field">
            <span>Daudzums</span>
            <input
              defaultValue={item.quantity.toString()}
              min="0.01"
              name="quantity"
              required
              step="0.01"
              type="number"
            />
          </label>

          <label className="field">
            <span>Iepirkums / gab.</span>
            <input
              defaultValue={item.partPurchasePrice.toString()}
              min="0"
              name="partPurchasePrice"
              required
              step="0.01"
              type="number"
            />
          </label>

          <label className="field">
            <span>Pārdošana / gab.</span>
            <input
              defaultValue={item.partSalePrice.toString()}
              min="0"
              name="partSalePrice"
              required
              step="0.01"
              type="number"
            />
          </label>

          <label className="field">
            <span>Stundas</span>
            <input
              defaultValue={item.laborHours.toString()}
              min="0"
              name="laborHours"
              required
              step="0.25"
              type="number"
            />
          </label>
        </div>

        <div className="item-meta">
          <div className="mini-metric">
            <span>Izmaksas</span>
            <strong>{formatCurrency(calculations.lineCost)}</strong>
          </div>
          <div className="mini-metric">
            <span>Ienākumi</span>
            <strong>{formatCurrency(calculations.lineRevenue)}</strong>
          </div>
          <div className={`mini-metric ${calculations.lineProfit >= 0 ? "profit-good" : "profit-bad"}`}>
            <span>Peļņa</span>
            <strong>{formatCurrency(calculations.lineProfit)}</strong>
          </div>
        </div>

        <label className="field">
          <span>Piezīmes</span>
          <textarea defaultValue={item.notes ?? ""} name="notes" rows={2} />
        </label>

        <div className="item-actions">
          <button className="btn btn-secondary" type="submit">
            Saglabāt rindu
          </button>
        </div>
      </form>

      <form action={deleteJobItemAction}>
        <input name="jobId" type="hidden" value={jobId} />
        <input name="itemId" type="hidden" value={item.id} />
        <button className="btn btn-ghost" type="submit">
          Dzēst rindu
        </button>
      </form>
    </article>
  );
}
