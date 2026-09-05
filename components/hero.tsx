"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="max-w-4xl mx-auto px-6 pt-40 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm mb-10" style={{ color: "#444" }}>
          Yakkabog&apos;, Qashqadaryo — O&apos;zbekiston
        </p>

        <h1
          className="font-semibold leading-snug mb-8"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#e5e5e5" }}
        >
          Samar Baxtiyorov
        </h1>

        <p className="text-base mb-6 max-w-xl leading-relaxed" style={{ color: "#666" }}>
          Frontend developer. 17 yoshda real mahsulotlar quraman —
          SavdoAI, RestNova, Teacher AI. O&apos;quv loyihalari emas.
        </p>

        <p className="text-sm leading-relaxed max-w-lg" style={{ color: "#444" }}>
          Frontend → Full-Stack → Cybersecurity yo&apos;nalishida harakat qilyapman.
          Hozir Teacher AI MVPdan SaaSga o&apos;tkazilmoqda.
        </p>

        <div className="flex items-center gap-6 mt-12">
          <a
            href="#projects"
            className="text-sm transition-colors duration-200"
            style={{ color: "#e5e5e5", textDecoration: "underline", textUnderlineOffset: "4px", textDecorationColor: "rgba(255,255,255,0.2)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecorationColor = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecorationColor = "rgba(255,255,255,0.2)")}
          >
            Loyihalar
          </a>
          <a
            href="mailto:camarbakhtiyarov@gmail.com"
            className="text-sm transition-colors duration-200"
            style={{ color: "#555" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e5e5e5")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
          >
            Bog&apos;lanish
          </a>
        </div>
      </motion.div>
    </section>
  );
}
