"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { createJobAction } from "@/app/actions";

type NewJobModalProps = {
  defaultDate: string;
};

export function NewJobModal({ defaultDate }: NewJobModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)} type="button">
        Jauns darbs +
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="modal-shell"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            role="presentation"
            transition={{ duration: 0.15 }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-modal="true"
              className="modal-card"
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="modal-header">
                <div>
                  <p className="eyebrow">Jauns ieraksts</p>
                  <h2>Izveidot darba galveni</h2>
                </div>
                <button
                  aria-label="Aizvērt"
                  className="icon-button"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <form action={createJobAction} className="field-grid">
                <label className="field">
                  <span>Datums</span>
                  <input defaultValue={defaultDate} name="date" required type="date" />
                </label>

                <label className="field">
                  <span>Numurzīme</span>
                  <input
                    autoCapitalize="characters"
                    name="plateNumber"
                    placeholder="AB1234"
                    required
                    type="text"
                  />
                </label>

                <label className="field">
                  <span>Klienta vārds</span>
                  <input name="clientName" placeholder="Jānis Bērziņš" type="text" />
                </label>

                <label className="field">
                  <span>Tel. numurs</span>
                  <input name="clientPhone" placeholder="+371 20000000" type="tel" />
                </label>

                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsOpen(false)}
                    type="button"
                  >
                    Atcelt
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Saglabāt un atvērt
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
