"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Ticket, Shield } from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap = {
  Sparkles,
  Users,
  Ticket,
  Shield,
} as const;

export default function Features() {
  return (
    <section id="features" className="section-padding bg-background-light dark:bg-background-dark">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Todo lo que necesitas para viajar
          </h2>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
            Desde la planificación hasta el viaje, Gaid Trip te acompaña en cada paso
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
