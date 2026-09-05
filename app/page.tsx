"use client";

import { useEffect, useState } from "react";
import Cursor from "@/components/cursor";
import Image from "next/image";
import { projects, journey } from "@/data/projects";

// ── MOUSE SPOTLIGHT (Brittany Chiang style) ──────────────────────────────────
function Spotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300"
      style={{
        background: `radial-gradient(650px circle at ${pos.x}px ${pos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  );
}

// ── TAG PILL ─────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
      style={{ background: "rgba(45, 212, 191, 0.1)", color: "#5eead4" }}
    >
      {label}
    </span>
  );
}

export default function Home() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const ids = ["about", "projects", "journey"];
    const obs = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  const navLinks = [
    { href: "#about", label: "Haqimda" },
    { href: "#projects", label: "Loyihalar" },
    { href: "#journey", label: "Sayohat" },
  ];

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Cursor />
      <Spotlight />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div className="layout-grid">

          {/* ════════ LEFT STICKY SIDEBAR ════════ */}
          <header className="sidebar">
            {/* Top: Avatar + Name + Role + Bio */}
            <div>
              {/* Avatar Photo */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(45, 212, 191, 0.5)",
                    boxShadow: "0 0 20px rgba(45, 212, 191, 0.2)",
                  }}
                  className="transition duration-300 hover:border-teal-300 hover:shadow-[0_0_25px_rgba(45,212,191,0.35)]"
                >
                  <Image
                    src="/samar.png"
                    alt="Samar Baxtiyorov"
                    fill
                    priority
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </div>

              <h1
                style={{
                  color: "#e2e8f0",
                  fontSize: "2.6rem",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                }}
              >
                <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
                  Samar Baxtiyorov
                </a>
              </h1>
              <h2
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  marginTop: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                Frontend Developer
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  marginTop: "12px",
                  maxWidth: "300px",
                }}
              >
                17 yoshda haqiqiy foyda keltiradigan loyihalar va veb-platformalar quraman.
              </p>

              {/* Navigation Indicator Links */}
              <nav className="hidden lg:block" style={{ marginTop: "32px" }}>
                <ul>
                  {navLinks.map(({ href, label }) => {
                    const isActive = active === href.slice(1);
                    return (
                      <li key={href}>
                        <a
                          href={href}
                          className="group flex items-center"
                          style={{ padding: "8px 0", textDecoration: "none" }}
                        >
                          <span
                            className="transition-all duration-300 group-hover:w-16 group-hover:bg-slate-200"
                            style={{
                              display: "inline-block",
                              height: "1px",
                              width: isActive ? "64px" : "32px",
                              background: isActive ? "#e2e8f0" : "#475569",
                              marginRight: "16px",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: isActive ? "#e2e8f0" : "#64748b",
                              transition: "color 0.2s",
                            }}
                            className="group-hover:text-slate-200"
                          >
                            {label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Bottom: Brittany Chiang style Social & Contact Icons */}
            <div style={{ marginTop: "auto", paddingTop: "24px" }}>
              <ul style={{ display: "flex", alignItems: "center", gap: "20px", listStyle: "none" }}>
                {/* Telegram */}
                <li>
                  <a
                    href="https://t.me/camar_me"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Telegram"
                    title="Telegram: @camar_me"
                    className="block transition duration-200"
                    style={{ color: "#94a3b8" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </a>
                </li>

                {/* Instagram */}
                <li>
                  <a
                    href="https://instagram.com/camar.me"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Instagram"
                    title="Instagram: @camar.me"
                    className="block transition duration-200"
                    style={{ color: "#94a3b8" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </li>

                {/* Email */}
                <li>
                  <a
                    href="mailto:camarbakhtiyarov@gmail.com"
                    aria-label="Email"
                    title="camarbakhtiyarov@gmail.com"
                    className="block transition duration-200"
                    style={{ color: "#94a3b8" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </li>

                {/* Phone */}
                <li>
                  <a
                    href="tel:+998200191809"
                    aria-label="Telefon"
                    title="+998 20 019 18 09"
                    className="block transition duration-200"
                    style={{ color: "#94a3b8" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </a>
                </li>
              </ul>
              <p style={{ color: "#475569", fontSize: "0.75rem", marginTop: "16px" }}>
                Yakkabog&apos;, Qashqadaryo · O&apos;zbekiston
              </p>
            </div>
          </header>

          {/* ════════ RIGHT SCROLLABLE ════════ */}
          <main className="main-content">

            {/* ── ABOUT SECTION ────────────────────── */}
            <section id="about" className="section-block" aria-label="Haqimda">
              <SectionHeader label="Haqimda" />
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <p style={{ fontSize: "1rem", lineHeight: "1.75", color: "#94a3b8" }}>
                  Salom! Men Samar — 17 yoshli dasturchi va IT loyihalar yaratuvchisiman. Hozir asosiy e&apos;tiborimni{" "}
                  <span style={{ color: "#e2e8f0", fontWeight: 500 }}>Frontend Development</span>ga qaratganman va 11 oylik dasturlash kursida chuqur bilim olmoqdaman.
                </p>
                <p style={{ fontSize: "1rem", lineHeight: "1.75", color: "#94a3b8" }}>
                  HTML, CSS, JavaScriptdan tortib{" "}
                  <span style={{ color: "#e2e8f0", fontWeight: 500 }}>React, Next.js va TypeScript</span>gacha bo&apos;lgan zamonaviy texnologiyalarni real loyihalar yaratish orqali amaliyotda mustahkamlayman.
                </p>
                <p style={{ fontSize: "1rem", lineHeight: "1.75", color: "#94a3b8" }}>
                  Shu bilan birga, o&apos;quv markazida bolalarga dasturlash asoslarini o&apos;rgataman, turli nufuzli hackathonlarda ishtirok etaman hamda{" "}
                  <a
                    href="https://t.me/camar_me"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ color: "#5eead4", textDecoration: "none", fontWeight: 500 }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
                  >
                    GEN-Z Uzbekistan
                  </a>{" "}
                  tarmog&apos;ida volontyor sifatida yoshlar tashabbuslarini qo&apos;llab-quvvatlayman.
                </p>
                <p style={{ fontSize: "1rem", lineHeight: "1.75", color: "#94a3b8" }}>
                  Maqsadim:{" "}
                  <span style={{ color: "#e2e8f0", fontWeight: 500 }}>Frontend → Full-Stack → Cybersecurity</span>. Men o&apos;zini tayyor mutaxassis emas, balki real muammolarga yechim topish va xatolar orqali toblanib borayotgan amaliyotchi dasturchi deb bilaman.
                </p>
              </div>
            </section>

            {/* ── PROJECTS SECTION ─────────────────── */}
            <section id="projects" className="section-block" aria-label="Loyihalar">
              <SectionHeader label="Loyihalar" />
              <ul className="group/list" style={{ listStyle: "none" }}>
                {projects.map((p) => (
                  <li key={p.id} style={{ marginBottom: "48px" }}>
                    <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                      
                      {/* Hover Highlight Box */}
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />

                      {/* Project Preview Image (Brittany style left thumbnail) */}
                      <div className="z-10 sm:order-1 sm:col-span-2 sm:translate-y-1">
                        <div
                          className="relative aspect-video w-full rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 overflow-hidden bg-slate-900 shadow-md"
                        >
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 200px"
                            className="object-cover object-top"
                          />
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="z-10 sm:order-2 sm:col-span-6">
                        <h3>
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-baseline font-medium leading-tight text-base transition-colors duration-200"
                            style={{ color: "#e2e8f0", textDecoration: "none" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#5eead4")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
                          >
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                            <span>
                              {p.title}{" "}
                              <span style={{ color: "#64748b", fontWeight: 400, fontSize: "0.85rem" }}>
                                · {p.subtitle}
                              </span>
                              <span className="inline-block">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 ml-1"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </span>
                          </a>
                        </h3>

                        <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: "1.6", marginTop: "8px", marginBottom: "12px" }}>
                          {p.description}
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {p.tags.map((tag) => (
                            <Tag key={tag} label={tag} />
                          ))}
                        </div>
                      </div>

                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── JOURNEY SECTION ──────────────────── */}
            <section id="journey" className="section-block" aria-label="Sayohat">
              <SectionHeader label="Sayohat" />
              <ol className="group/list" style={{ listStyle: "none" }}>
                {journey.map((item, i) => (
                  <li key={i} style={{ marginBottom: "36px" }}>
                    <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
                      
                      <div className="z-10 sm:col-span-2">
                        <p style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", paddingTop: "2px" }}>
                          {item.year}
                        </p>
                      </div>
                      
                      <div className="z-10 sm:col-span-6">
                        <p style={{ color: "#e2e8f0", fontSize: "0.95rem", fontWeight: 500, marginBottom: "6px" }}>
                          {item.title}
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: "1.6" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Footer */}
            <footer style={{ paddingTop: "40px", color: "#475569", fontSize: "0.75rem", lineHeight: "1.6" }}>
              <p>
                Dizayn va arxitektura{" "}
                <a
                  href="https://brittanychiang.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ color: "#94a3b8", textDecoration: "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#5eead4")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
                >
                  Brittany Chiang
                </a>
                ning mashhur portfoliolaridan ilhomlangan holda Next.js va Tailwind CSS yordamida Samar Baxtiyorov tomonidan yaratildi.
              </p>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}

// ── SECTION HEADER (Always visible with clear separation) ───────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="section-header-wrap">
      <div className="section-header-pill">
        <span className="section-header-dot" />
        <h2>{label}</h2>
      </div>
      <div className="section-header-line" />
    </div>
  );
}
