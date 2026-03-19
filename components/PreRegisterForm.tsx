"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export default function PreRegisterForm({ variant = "hero" }: { variant?: "hero" | "cta" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simular envío — conectar con Firebase cuando esté listo
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setEmail("");

    setTimeout(() => setStatus("idle"), 4000);
  };

  const isHero = variant === "hero";

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.6, 1] }}
            className="flex items-center gap-2 text-success font-medium"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <CheckCircle className="w-5 h-5" />
            </motion.div>
            <span>Te avisaremos cuando esté disponible</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={false}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                isHero
                  ? "bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-primary-light focus:ring-1 focus:ring-primary-light"
                  : "bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-text-primary-light dark:text-white placeholder:text-text-secondary-light dark:placeholder:text-white/50 focus:border-primary focus:ring-1 focus:ring-primary"
              }`}
            />
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Avísame
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
