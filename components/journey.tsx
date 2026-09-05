"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { journey } from "@/data/projects";

export default function Journey() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="journey" ref={ref} className="max-w-4xl mx-auto px-6 pb-28">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="text-xs uppercase tracking-widest mb-10"
        style={{ color: "#333" }}
      >
        Sayohat
      </motion.p>

      <div className="space-y-8">
        {journey.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-10"
          >
            <span
              className="text-xs font-mono flex-shrink-0 pt-0.5 sm:w-12 tabular-nums"
              style={{ color: "#333" }}
            >
              {item.year}
            </span>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "#e5e5e5" }}>
                {item.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
