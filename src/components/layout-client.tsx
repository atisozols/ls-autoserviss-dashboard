"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            animate={{ opacity: 1 }}
            className="loading-screen"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              className="loading-spinner"
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: 6 }}
          key={pathname}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
