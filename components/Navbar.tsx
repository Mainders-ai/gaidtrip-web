"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-main flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-primary">Gaid</span>
          <span className="text-text-primary-light dark:text-text-primary-dark">Trip</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#hero"
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-opacity"
          >
            Descargar App
          </a>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#hero"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary"
            >
              Descargar App
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
