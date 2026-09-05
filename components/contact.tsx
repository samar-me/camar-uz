"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const links = [
  { label: "Telegram", href: "https://t.me/camar_me", value: "@camar_me" },
  { label: "Instagram", href: "https://instagram.com/camar.me", value: "@camar.me" },
  { label: "Email", href: "mailto:camarbakhtiyarov@gmail.com", value: "camarbakhtiyarov@gmail.com" },
  { label: "Telefon", href: "tel:+998200191809", value: "+998 20 019 18 09" },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="max-w-4xl mx-auto px-6 pb-32">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="text-xs uppercase tracking-widest mb-10"
        style={{ color: "#333" }}
      >
        Bog&apos;lanish
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xl font-medium mb-12 max-w-sm leading-snug"
        style={{ color: "#e5e5e5" }}
      >
        Loyiha, hamkorlik yoki salomlashish — har qanday vaqt.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {links.map((l, i) => (
          <div
            key={l.label}
            className="flex items-center gap-8"
          >
            <span className="text-xs w-16 flex-shrink-0" style={{ color: "#333" }}>
              {l.label}
            </span>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200"
              style={{ color: "#555" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e5e5e5")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
            >
              {l.value}
            </a>
          </div>
        ))}
      </motion.div>

      <div
        className="mt-24 pt-8 flex justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="text-xs" style={{ color: "#2a2a2a" }}>
          © 2025 Samar Baxtiyorov
        </span>
        <span className="text-xs" style={{ color: "#2a2a2a" }}>
          Yakkabog&apos;, Qashqadaryo
        </span>
      </div>
    </section>
  );
}
