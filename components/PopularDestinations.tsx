"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DESTINATIONS } from "@/lib/constants";
import { useRef, useState } from "react";

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -10;
    const rotateY = (x - 0.5) * 10;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: transform ? "transform 0.1s ease-out" : "transform 0.4s ease-out" }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function PopularDestinations() {
  return (
    <section className="section-padding bg-background-light dark:bg-background-dark">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Destinos populares
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Inspiración para tu próximo viaje
          </h2>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
            Itinerarios listos para personalizar con IA
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />

                {/* Gradient overlay — intensifies on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1 inline-block">
                    {dest.emoji}
                  </p>
                  <h3 className="text-lg font-bold text-white">{dest.name}</h3>
                  <p className="text-sm text-white/70">{dest.country}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs text-white font-medium">
                      {dest.days} días
                    </span>
                  </div>

                  {/* Hover reveal */}
                  <div className="mt-3 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
                    <p className="text-xs text-white/60 border-t border-white/10 pt-2">
                      {dest.highlight}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
