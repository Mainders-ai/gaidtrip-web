"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/constants";

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 dark:border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
      >
        <span className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-text-secondary-light dark:text-text-secondary-dark transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-background-light dark:bg-background-dark">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Preguntas frecuentes
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-white/5"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
