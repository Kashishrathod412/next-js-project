"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Shoot.", "Cut.", "Deliver."];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION_MS = 2400; // Increased to 2.4s for a more cinematic, deliberate feel

  useEffect(() => {
    // Word rotation logic (syncs with duration, 3 words = DURATION_MS / 3 per word)
    const intervalTime = DURATION_MS / WORDS.length;
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev < WORDS.length - 1 ? prev + 1 : prev));
    }, intervalTime);

    // Progress bar and counter logic
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const updateProgress = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }
      const elapsed = currentTime - startTime;
      const nextProgress = Math.min((elapsed / DURATION_MS) * 100, 100);
      
      // Easing function for smoother progress (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - nextProgress / 100, 4);
      setProgress(easeProgress * 100);

      if (elapsed < DURATION_MS) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          onComplete();
        }, 200); // Tiny pause at 100% before firing complete
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      clearInterval(wordInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Format progress to exactly 3 digits
  const formattedProgress = Math.floor(progress).toString().padStart(3, "0");

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Subtle Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Top Left Eyebrow */}
      <motion.div
        className="absolute top-8 left-8 text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        Videographer & Editor
      </motion.div>

      {/* Center Words */}
      <div className="relative z-10 flex items-center justify-center min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)", scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-display italic text-white tracking-tight drop-shadow-2xl absolute"
          >
            {WORDS[currentWord]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Huge Counter */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-12 text-[120px] md:text-[220px] font-display text-white/[0.03] tabular-nums tracking-tighter leading-none pointer-events-none select-none">
        {formattedProgress}
      </div>
      
      {/* Foreground Small Counter */}
      <motion.div 
        className="absolute bottom-8 right-8 text-sm uppercase tracking-[0.2em] font-mono text-white/60 tabular-nums hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        [{formattedProgress}%]
      </motion.div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 origin-left overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
