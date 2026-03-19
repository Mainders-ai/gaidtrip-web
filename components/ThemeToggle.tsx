"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors overflow-hidden w-9 h-9 flex items-center justify-center"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          dark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Moon className="w-5 h-5 text-blue-300" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </button>
  );
}
