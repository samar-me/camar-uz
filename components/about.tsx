"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillGroups = [
  {
    category: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    category: "Boshqa",
    items: ["Python", "AI / Prompt Eng.", "SMM", "Soft Skills"],
  },
];

const facts = [
  { label: "Yosh", value: "17" },
  { label: "Kurs", value: "11 oylik Frontend" },
  { label: "O'qitaman", value: "HTML & CSS" },
  { label: "Faoliyat", value: "GEN-Z Uzbekistan" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="max-w-4xl mx-auto px-6 pb-28">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="text-xs uppercase tracking-widest mb-10"
        style={{ color: "#333" }}
      >
        Haqimda
      </motion.p>

      <div className="grid sm:grid-cols-2 gap-16">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#666" }}>
            Men hozir tayyor mutaxassis emasman. Men o&apos;zini real loyihalar,
            xatolar va tajriba orqali qurayotgan dasturchiman.
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "#555" }}>
            O&apos;quv markazida bolalarga HTML va CSS asoslarini o&apos;rgataman.
            Hackathonlarda qatnashaman. IT orqali hozirning o&apos;zida daromad
            olishni boshlaganman.
          </p>

          {/* Facts */}
          <div className="space-y-3">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#333" }}>
                  {f.label}
                </span>
                <span className="text-xs" style={{ color: "#666" }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Skills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {skillGroups.map((group) => (
            <div key={group.category} className="mb-8">
              <p className="text-xs mb-4" style={{ color: "#333" }}>
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1"
                    style={{
                      color: "#555",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "2px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
