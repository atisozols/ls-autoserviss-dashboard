"use client";

import { motion } from "framer-motion";
import { useActionState } from "react";

import { loginAction } from "@/app/actions";
import { p } from "framer-motion/client";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="login-shell">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="login-card"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="login-header">
          <p>Pieslēdzieties, lai turpinātu</p>
        </div>

        <form action={formAction} className="login-form">
          {state?.error && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="login-error"
              initial={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {state.error}
            </motion.div>
          )}

          <label className="field">
            <span>Lietotājvārds</span>
            <input
              autoComplete="username"
              autoFocus
              name="username"
              required
              type="text"
            />
          </label>

          <label className="field">
            <span>Parole</span>
            <input
              autoComplete="current-password"
              name="password"
              required
              type="password"
            />
          </label>

          <button
            className="btn btn-primary btn-full"
            disabled={pending}
            type="submit"
          >
            {pending ? <span className="btn-spinner" /> : null}
            Pieslēgties
          </button>
        </form>
      </motion.div>
    </div>
  );
}
