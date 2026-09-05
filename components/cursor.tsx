"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const tag = (e.target as HTMLElement).tagName;
      const cur = window.getComputedStyle(e.target as HTMLElement).cursor;
      setIsPointer(cur === "pointer" || tag === "A" || tag === "BUTTON");
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[99999] pointer-events-none"
      animate={{ x: pos.x - 6, y: pos.y - 6, scale: isPointer ? 1.5 : 1 }}
      transition={{ duration: 0, ease: "linear" }}
    >
      <div
        className="w-3 h-3 rounded-full mix-blend-difference"
        style={{ background: "#e2e8f0" }}
      />
    </motion.div>
  );
}
