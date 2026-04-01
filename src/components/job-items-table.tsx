"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import { addJobItemAction, deleteJobItemAction, updateJobItemAction } from "@/app/actions";
import { calculateJobItem, formatCurrency } from "@/lib/calculations";

type ItemData = {
  id: string;
  partName: string;
  partCode: string | null;
  quantity: string | number;
  partPurchasePrice: string | number;
  partSalePrice: string | number;
  laborHours: string | number;
  laborRate: string | number;
  employeeHourlyCost: string | number;
  notes: string | null;
};

type RowValues = {
  partName: string;
  partCode: string;
  quantity: string;
  partPurchasePrice: string;
  partSalePrice: string;
  laborHours: string;
  notes: string;
};

type SaveStatus = "saved" | "saving" | "unsaved";

function ItemRow({
  item,
  jobId,
  index,
  onDelete,
}: {
  item: ItemData;
  jobId: string;
  index: number;
  onDelete: (id: string) => void;
}) {
  const [values, setValues] = useState<RowValues>({
    partName: item.partName,
    partCode: item.partCode ?? "",
    quantity: String(item.quantity),
    partPurchasePrice: String(item.partPurchasePrice),
    partSalePrice: String(item.partSalePrice),
    laborHours: String(item.laborHours),
    notes: item.notes ?? "",
  });
  const [status, setStatus] = useState<SaveStatus>("saved");
  const dirty = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const calc = calculateJobItem({
    quantity: values.quantity || "0",
    partPurchasePrice: values.partPurchasePrice || "0",
    partSalePrice: values.partSalePrice || "0",
    laborHours: values.laborHours || "0",
    laborRate: item.laborRate,
    employeeHourlyCost: item.employeeHourlyCost,
  });

  function handleChange(field: keyof RowValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    dirty.current = true;
    setStatus("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(), 800);
  }

  async function save() {
    if (!dirty.current || !values.partName.trim()) return;
    setStatus("saving");
    const fd = new FormData();
    fd.append("jobId", jobId);
    fd.append("itemId", item.id);
    fd.append("partName", values.partName);
    fd.append("partCode", values.partCode);
    fd.append("quantity", values.quantity);
    fd.append("partPurchasePrice", values.partPurchasePrice);
    fd.append("partSalePrice", values.partSalePrice);
    fd.append("laborHours", values.laborHours);
    fd.append("laborRate", String(item.laborRate));
    fd.append("employeeHourlyCost", String(item.employeeHourlyCost));
    fd.append("notes", values.notes);
    await updateJobItemAction(fd);
    dirty.current = false;
    setStatus("saved");
  }

  function handleBlur() {
    clearTimeout(saveTimer.current);
    save();
  }

  async function handleDelete() {
    onDelete(item.id);
    const fd = new FormData();
    fd.append("jobId", jobId);
    fd.append("itemId", item.id);
    await deleteJobItemAction(fd);
  }

  return (
    <motion.tr
      animate={{ opacity: 1, x: 0 }}
      className="item-row"
      exit={{ opacity: 0, x: -20 }}
      initial={{ opacity: 0, x: 20 }}
      layout
      transition={{ duration: 0.15 }}
    >
      <td className="col-num">{index + 1}</td>
      <td className="col-name">
        <input
          className="table-input"
          name="partName"
          onBlur={handleBlur}
          onChange={(e) => handleChange("partName", e.target.value)}
          placeholder="Detaļa / darbs"
          value={values.partName}
        />
      </td>
      <td className="col-code">
        <input
          className="table-input"
          name="partCode"
          onBlur={handleBlur}
          onChange={(e) => handleChange("partCode", e.target.value)}
          placeholder="Kods"
          value={values.partCode}
        />
      </td>
      <td className="col-qty">
        <input
          className="table-input table-input-num"
          min="0"
          name="quantity"
          onBlur={handleBlur}
          onChange={(e) => handleChange("quantity", e.target.value)}
          step="1"
          type="number"
          value={values.quantity}
        />
      </td>
      <td className="col-price">
        <input
          className="table-input table-input-num"
          min="0"
          name="partPurchasePrice"
          onBlur={handleBlur}
          onChange={(e) => handleChange("partPurchasePrice", e.target.value)}
          step="0.01"
          type="number"
          value={values.partPurchasePrice}
        />
      </td>
      <td className="col-price">
        <input
          className="table-input table-input-num"
          min="0"
          name="partSalePrice"
          onBlur={handleBlur}
          onChange={(e) => handleChange("partSalePrice", e.target.value)}
          step="0.01"
          type="number"
          value={values.partSalePrice}
        />
      </td>
      <td className="col-hours">
        <input
          className="table-input table-input-num"
          min="0"
          name="laborHours"
          onBlur={handleBlur}
          onChange={(e) => handleChange("laborHours", e.target.value)}
          step="0.25"
          type="number"
          value={values.laborHours}
        />
      </td>
      <td className="col-notes">
        <input
          className="table-input"
          name="notes"
          onBlur={handleBlur}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Piezīmes"
          value={values.notes}
        />
      </td>
      <td className={`col-profit ${calc.lineProfit >= 0 ? "profit-good" : "profit-bad"}`}>
        {formatCurrency(calc.lineProfit)}
      </td>
      <td className="col-status">
        <span className={`save-dot save-dot-${status}`} title={status === "saved" ? "Saglabāts" : status === "saving" ? "Saglabā..." : "Nav saglabāts"} />
      </td>
      <td className="col-del">
        <button className="del-btn" onClick={handleDelete} title="Dzēst" type="button">
          ×
        </button>
      </td>
    </motion.tr>
  );
}

type NewRowValues = {
  partName: string;
  partCode: string;
  quantity: string;
  partPurchasePrice: string;
  partSalePrice: string;
  laborHours: string;
  notes: string;
};

function NewItemRow({
  jobId,
  defaultLaborRate,
  defaultEmployeeHourlyCost,
  onAdded,
}: {
  jobId: string;
  defaultLaborRate: number;
  defaultEmployeeHourlyCost: number;
  onAdded: (item: ItemData) => void;
}) {
  const [values, setValues] = useState<NewRowValues>({
    partName: "",
    partCode: "",
    quantity: "1",
    partPurchasePrice: "0",
    partSalePrice: "0",
    laborHours: "0",
    notes: "",
  });
  const [adding, setAdding] = useState(false);

  const calc = calculateJobItem({
    quantity: values.quantity || "0",
    partPurchasePrice: values.partPurchasePrice || "0",
    partSalePrice: values.partSalePrice || "0",
    laborHours: values.laborHours || "0",
    laborRate: defaultLaborRate,
    employeeHourlyCost: defaultEmployeeHourlyCost,
  });

  function reset() {
    setValues({
      partName: "",
      partCode: "",
      quantity: "1",
      partPurchasePrice: "0",
      partSalePrice: "0",
      laborHours: "0",
      notes: "",
    });
  }

  async function handleAdd() {
    if (!values.partName.trim()) return;
    setAdding(true);
    const fd = new FormData();
    fd.append("jobId", jobId);
    fd.append("partName", values.partName);
    fd.append("partCode", values.partCode);
    fd.append("quantity", values.quantity);
    fd.append("partPurchasePrice", values.partPurchasePrice);
    fd.append("partSalePrice", values.partSalePrice);
    fd.append("laborHours", values.laborHours);
    fd.append("laborRate", String(defaultLaborRate));
    fd.append("employeeHourlyCost", String(defaultEmployeeHourlyCost));
    fd.append("notes", values.notes);
    const newItem = await addJobItemAction(fd);
    onAdded({
      ...newItem,
      quantity: String(newItem.quantity),
      partPurchasePrice: String(newItem.partPurchasePrice),
      partSalePrice: String(newItem.partSalePrice),
      laborHours: String(newItem.laborHours),
      laborRate: String(newItem.laborRate),
      employeeHourlyCost: String(newItem.employeeHourlyCost),
    });
    reset();
    setAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <tr className="item-row new-item-row">
      <td className="col-num new-row-num">+</td>
      <td className="col-name">
        <input
          className="table-input"
          onChange={(e) => setValues((p) => ({ ...p, partName: e.target.value }))}
          onKeyDown={handleKeyDown}
          placeholder="Detaļa / darbs *"
          value={values.partName}
        />
      </td>
      <td className="col-code">
        <input
          className="table-input"
          onChange={(e) => setValues((p) => ({ ...p, partCode: e.target.value }))}
          onKeyDown={handleKeyDown}
          placeholder="Kods"
          value={values.partCode}
        />
      </td>
      <td className="col-qty">
        <input
          className="table-input table-input-num"
          min="0"
          onChange={(e) => setValues((p) => ({ ...p, quantity: e.target.value }))}
          onKeyDown={handleKeyDown}
          step="1"
          type="number"
          value={values.quantity}
        />
      </td>
      <td className="col-price">
        <input
          className="table-input table-input-num"
          min="0"
          onChange={(e) => setValues((p) => ({ ...p, partPurchasePrice: e.target.value }))}
          onKeyDown={handleKeyDown}
          step="0.01"
          type="number"
          value={values.partPurchasePrice}
        />
      </td>
      <td className="col-price">
        <input
          className="table-input table-input-num"
          min="0"
          onChange={(e) => setValues((p) => ({ ...p, partSalePrice: e.target.value }))}
          onKeyDown={handleKeyDown}
          step="0.01"
          type="number"
          value={values.partSalePrice}
        />
      </td>
      <td className="col-hours">
        <input
          className="table-input table-input-num"
          min="0"
          onChange={(e) => setValues((p) => ({ ...p, laborHours: e.target.value }))}
          onKeyDown={handleKeyDown}
          step="0.25"
          type="number"
          value={values.laborHours}
        />
      </td>
      <td className="col-notes">
        <input
          className="table-input"
          onChange={(e) => setValues((p) => ({ ...p, notes: e.target.value }))}
          onKeyDown={handleKeyDown}
          placeholder="Piezīmes"
          value={values.notes}
        />
      </td>
      <td className={`col-profit ${calc.lineProfit >= 0 ? "profit-good" : "profit-bad"}`}>
        {formatCurrency(calc.lineProfit)}
      </td>
      <td className="col-status" />
      <td className="col-del">
        <button
          className="add-row-btn"
          disabled={adding || !values.partName.trim()}
          onClick={handleAdd}
          title="Pievienot (Enter)"
          type="button"
        >
          {adding ? "…" : "✓"}
        </button>
      </td>
    </tr>
  );
}

export type JobItemsTableProps = {
  jobId: string;
  initialItems: ItemData[];
  defaultLaborRate: number;
  defaultEmployeeHourlyCost: number;
};

export function JobItemsTable({
  jobId,
  initialItems,
  defaultLaborRate,
  defaultEmployeeHourlyCost,
}: JobItemsTableProps) {
  const [items, setItems] = useState<ItemData[]>(initialItems);

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAdded(item: ItemData) {
    setItems((prev) => [...prev, item]);
  }

  return (
    <div className="items-table-wrap">
      <table className="items-table">
        <thead>
          <tr>
            <th className="col-num">#</th>
            <th className="col-name">Detaļa / darbs</th>
            <th className="col-code">Kods</th>
            <th className="col-qty">Daudz.</th>
            <th className="col-price">Iepirkums</th>
            <th className="col-price">Pārdošana</th>
            <th className="col-hours">Stundas</th>
            <th className="col-notes">Piezīmes</th>
            <th className="col-profit">Peļņa</th>
            <th className="col-status" />
            <th className="col-del" />
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {items.map((item, i) => (
              <ItemRow
                index={i}
                item={item}
                jobId={jobId}
                key={item.id}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
          <NewItemRow
            defaultEmployeeHourlyCost={defaultEmployeeHourlyCost}
            defaultLaborRate={defaultLaborRate}
            jobId={jobId}
            onAdded={handleAdded}
          />
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="empty-state empty-state-inline">
          <p>Vēl nav pozīciju. Aizpildi augšējo rindu un spied Enter vai ✓.</p>
        </div>
      )}
    </div>
  );
}
