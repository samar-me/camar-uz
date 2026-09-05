"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { projects } from "@/data/projects";

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Index */}
      <span
        className="text-xs font-mono flex-shrink-0 pt-0.5 w-6"
        style={{ color: "#333" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Main */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-base font-medium" style={{ color: "#e5e5e5" }}>
            {project.title}
          </h3>
          <span className="text-xs" style={{ color: "#333" }}>
            {project.subtitle}
          </span>
          {project.status === "Live" && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
              <span className="w-1 h-1 rounded-full bg-emerald-600 inline-block" />
              Live
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#555" }}>
          {project.description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs" style={{ color: "#3a3a3a" }}>
                {tag}
              </span>
            ))}
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors duration-200"
              style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: "3px" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e5e5e5")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
            >
              Ko&apos;rish →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={ref} className="max-w-4xl mx-auto px-6 pb-28">
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="text-xs uppercase tracking-widest mb-10"
        style={{ color: "#333" }}
      >
        Loyihalar
      </motion.p>

      <div>
        {projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
