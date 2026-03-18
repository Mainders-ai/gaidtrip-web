"use client";

import { motion } from "framer-motion";
import PreRegisterForm from "./PreRegisterForm";

export default function CTASection() {
  return (
    <section className="section-padding bg-surface-light dark:bg-surface-dark">
      <div className="container-main max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary-light dark:text-text-primary-dark text-balance">
            ¿Listo para tu próxima{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              aventura
            </span>
            ?
          </h2>
          <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
            Déjanos tu email y te avisamos cuando Gaid Trip esté disponible
          </p>

          <div className="mt-8 flex justify-center">
            <PreRegisterForm variant="cta" />
          </div>

          <p className="mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Disponible próximamente en App Store y Google Play
          </p>
        </motion.div>
      </div>
    </section>
  );
}
