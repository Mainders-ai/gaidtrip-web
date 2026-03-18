"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles, Calendar, MessageCircle } from "lucide-react";

export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mx-auto w-[280px] sm:w-[300px]"
    >
      {/* Glow */}
      <div className="absolute inset-0 phone-glow rounded-[3rem]" />

      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl border border-white/10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="bg-gradient-to-b from-primary/20 via-background-dark to-background-dark rounded-[2.3rem] overflow-hidden aspect-[9/19.5] flex flex-col">
          {/* Status bar */}
          <div className="flex justify-between items-center px-8 pt-8 pb-2 text-[10px] text-white/60">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-3.5 h-2 border border-white/40 rounded-sm">
                <div className="w-2/3 h-full bg-success rounded-sm" />
              </div>
            </div>
          </div>

          {/* App content mockup */}
          <div className="flex-1 px-4 pb-4 space-y-3">
            {/* Header */}
            <div className="text-center pt-2">
              <p className="text-[10px] text-white/50">Tu itinerario</p>
              <p className="text-sm font-bold text-white">Roma, Italia</p>
              <p className="text-[10px] text-primary-light">5 días de aventura</p>
            </div>

            {/* Day cards */}
            {[
              { day: "Día 1", icon: MapPin, activity: "Coliseo & Foro Romano", time: "09:00" },
              { day: "Día 2", icon: Sparkles, activity: "Vaticano & Capilla Sixtina", time: "08:30" },
              { day: "Día 3", icon: Calendar, activity: "Trastevere & street food", time: "10:00" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-primary-light">{item.day}</p>
                      <p className="text-[9px] text-white/40">{item.time}</p>
                    </div>
                    <p className="text-[11px] text-white/90 truncate">{item.activity}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* AI Chat hint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex items-center gap-2 bg-accent/20 rounded-xl p-2.5 border border-accent/20"
            >
              <MessageCircle className="w-4 h-4 text-accent shrink-0" />
              <p className="text-[10px] text-white/70">
                &quot;Agrega un día de playa en Ostia&quot;
              </p>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="flex justify-around py-2 border-t border-white/5">
            {["Inicio", "Mapa", "Chat", "Perfil"].map((tab) => (
              <div key={tab} className="flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 rounded-full bg-white/10" />
                <span className="text-[8px] text-white/40">{tab}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
