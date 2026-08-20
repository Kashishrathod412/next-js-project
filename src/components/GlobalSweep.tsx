"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function GlobalSweep() {
  const sweepRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pathname.startsWith("/admin") || !sweepRef.current) return;
    const layers = sweepRef.current.querySelectorAll('.sweep-layer');
    
    gsap.fromTo(layers,
      { x: "-50vw" },
      {
        x: "180vw",
        duration: 18,
        ease: "none",
        repeat: -1,
        stagger: 0.8
      }
    );

    return () => {
      gsap.killTweensOf(layers);
      Array.from(layers).forEach(l => ((l as HTMLElement).style.willChange = "auto"));
    };
  }, [mounted, pathname]);

  if (!mounted || pathname.startsWith("/admin")) return null;

  return (
    <div ref={sweepRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none flex items-center justify-center mix-blend-screen">
      {/* Layer 1: Very large */}
      <div className="sweep-layer absolute top-[-50vh] left-[-50vw] w-[80vw] h-[200vh] rotate-[25deg] bg-[rgba(139,92,246,0.08)] blur-[120px]" style={{ willChange: "transform" }} />
      {/* Layer 2: Medium */}
      <div className="sweep-layer absolute top-[-50vh] left-[-50vw] w-[50vw] h-[200vh] rotate-[25deg] bg-[rgba(168,85,247,0.15)] blur-[80px]" style={{ willChange: "transform" }} />
      {/* Layer 3: Smaller */}
      <div className="sweep-layer absolute top-[-50vh] left-[-50vw] w-[25vw] h-[200vh] rotate-[25deg] bg-[rgba(196,181,253,0.20)] blur-[40px]" style={{ willChange: "transform" }} />
    </div>
  );
}
