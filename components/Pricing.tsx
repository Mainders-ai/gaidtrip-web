"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PRICING } from "@/lib/constants";

export default function Pricing() {
  return (
    <section id="precios" className="section-padding bg-surface-light dark:bg-surface-dark">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Precios
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Un plan para cada viajero
          </h2>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
            Comienza gratis y escala según tus necesidades
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative rounded-2xl p-6 lg:p-8 cursor-pointer transition-shadow duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? "gradient-primary text-white shadow-xl shadow-primary/20 scale-[1.03] border-0 shimmer-effect"
                  : "bg-background-light dark:bg-background-dark border border-gray-100 dark:border-white/5 hover:shadow-primary/10"
              }`}
            >
              {plan.highlighted && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 12,
                    delay: 0.4,
                  }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-white text-xs font-bold"
                >
                  Popular
                </motion.span>
              )}

              <h3
                className={`text-lg font-bold ${
                  plan.highlighted
                    ? "text-white"
                    : "text-text-primary-light dark:text-text-primary-dark"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-sm ${
                  plan.highlighted ? "text-white/70" : "text-text-secondary-light dark:text-text-secondary-dark"
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlighted
                      ? "text-white"
                      : "text-text-primary-light dark:text-text-primary-dark"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-white/60" : "text-text-secondary-light dark:text-text-secondary-dark"
                    }`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.highlighted ? "text-white" : "text-primary"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted
                          ? "text-white/90"
                          : "text-text-secondary-light dark:text-text-secondary-dark"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90"
                    : "gradient-primary text-white hover:opacity-90"
                }`}
              >
                Próximamente
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
