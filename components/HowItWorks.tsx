"use client";

import { motion, useInView } from "framer-motion";
import { MapPin, Sparkles, Navigation } from "lucide-react";
import { STEPS } from "@/lib/constants";
import { useRef } from "react";

const stepIcons = [MapPin, Sparkles, Navigation];

export default function HowItWorks() {
  const timelineRef = useRef(null);
  const isInView = useInView(timelineRef, { once: true, margin: "-100px" });

  return (
    <section
      id="como-funciona"
      className="section-padding bg-surface-light dark:bg-surface-dark"
    >
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Cómo funciona
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Tres pasos para tu viaje perfecto
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto" ref={timelineRef}>
          {/* Animated vertical line — centrada en el icono */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary-light to-accent hidden sm:block z-0"
          />

          <div className="space-y-12 sm:space-y-16">
            {STEPS.map((step, i) => {
              const Icon = stepIcons[i];
              const isRight = i % 2 !== 0;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative"
                >
                  {/* Mobile layout */}
                  <div className="flex items-center gap-6 sm:gap-8 lg:hidden">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.3 + i * 0.2,
                      }}
                      className="relative z-10 shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-node-pulse"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.2 }}
                        className="text-xs font-bold text-primary uppercase tracking-widest"
                      >
                        Paso {step.number}
                      </motion.span>
                      <h3 className="mt-1 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop layout: 3 columnas con icono centrado sobre la línea */}
                  <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:items-center">
                    {/* Columna izquierda */}
                    <div className={isRight ? "" : "text-right"}>
                      {!isRight && (
                        <>
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + i * 0.2 }}
                            className="text-xs font-bold text-primary uppercase tracking-widest"
                          >
                            Paso {step.number}
                          </motion.span>
                          <h3 className="mt-1 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                            {step.description}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Icono centrado sobre la línea */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.3 + i * 0.2,
                      }}
                      className="relative z-10 shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-node-pulse"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Columna derecha */}
                    <div className={isRight ? "" : ""}>
                      {isRight && (
                        <>
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + i * 0.2 }}
                            className="text-xs font-bold text-primary uppercase tracking-widest"
                          >
                            Paso {step.number}
                          </motion.span>
                          <h3 className="mt-1 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
                            {step.description}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
