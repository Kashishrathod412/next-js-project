"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function CursorGlow() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const glowX = useTransform(cursorX, (val) => val - 64);
  const glowY = useTransform(cursorY, (val) => val - 64);

  return (
    <motion.div
      className="fixed top-0 left-0 w-32 h-32 rounded-full bg-[#8b5cf6] opacity-30 blur-[40px] pointer-events-none z-[9999]"
      style={{
        x: glowX,
        y: glowY,
      }}
    />
  );
}
