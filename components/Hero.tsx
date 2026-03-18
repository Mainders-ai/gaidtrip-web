"use client";

import { motion } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import PreRegisterForm from "./PreRegisterForm";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden gradient-hero"
    >
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-light/5 rounded-full blur-3xl animate-float-slow" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-main px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 text-primary-light border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Disponible próximamente
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance"
            >
              Tu próximo viaje,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light">
                planeado por IA
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-white/70 max-w-lg mx-auto lg:mx-0 text-balance"
            >
              Itinerarios personalizados, compañeros de viaje, experiencias
              únicas. Todo en una app.
            </motion.p>

            {/* App store badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white/50 cursor-default">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] leading-tight">Próximamente en</p>
                  <p className="text-sm font-semibold leading-tight">App Store</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white/50 cursor-default">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.27.4.76.44 1.07.23l17.15-9.73c.29-.17.45-.5.45-.82s-.16-.65-.45-.82L4.25.89c-.31-.21-.8-.17-1.07.23-.16.24-.18.53-.18.78v21.08c0 .25.02.54.18.78zM5.5 3.53l12.01 6.83L5.5 17.19V3.53z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] leading-tight">Próximamente en</p>
                  <p className="text-sm font-semibold leading-tight">Google Play</p>
                </div>
              </div>
            </motion.div>

            {/* Pre-register form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex justify-center lg:justify-start"
            >
              <PreRegisterForm variant="hero" />
            </motion.div>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
