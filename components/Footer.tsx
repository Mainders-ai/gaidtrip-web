"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-surface-dark border-t border-gray-200 dark:border-white/10">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Logo + tagline */}
          <div className="text-center md:text-left">
            <a href="#" className="font-bold text-xl tracking-tight">
              <span className="text-white/70">Gaid</span>
              <span className="text-white font-extrabold"> Trip</span>
            </a>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {SITE.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <a href="#" className="hover:text-primary transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Términos
            </a>
            <a href="mailto:hola@gaidtrip.com" className="hover:text-primary transition-colors">
              Contacto
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {["Instagram", "TikTok", "X"].map((network, i) => (
              <motion.a
                key={network}
                href="#"
                aria-label={network}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary hover:text-white transition-colors"
              >
                {network[0]}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-center text-sm text-text-secondary-light dark:text-text-secondary-dark"
        >
          <span>&copy; {new Date().getFullYear()} Gaid Trip. Todos los derechos reservados.</span>
          <a
            href="/admin/login"
            className="ml-3 opacity-30 hover:opacity-100 transition-opacity"
            title="Admin"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
