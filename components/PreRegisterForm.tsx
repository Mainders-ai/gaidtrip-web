"use client";

import { useState } from "react";
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

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-success font-medium">
        <CheckCircle className="w-5 h-5" />
        <span>Te avisaremos cuando esté disponible</span>
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
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
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 transition-all"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Avísame
          </>
        )}
      </button>
    </form>
  );
}
