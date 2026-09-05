"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(17,17,17,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="text-sm" style={{ color: "#e5e5e5" }}>
          sb<span style={{ color: "#555" }}>.</span>
        </a>
        <nav className="flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm transition-colors duration-200"
              style={{ color: "#555" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e5e5e5")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#555")}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
