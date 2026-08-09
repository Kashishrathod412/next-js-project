"use client";

import { useEffect, useState, useRef } from "react";

export default function TimecodeOverlay() {
  const [timecode, setTimecode] = useState("00:14:23:00");
  const frameRef = useRef({ h: 0, m: 14, s: 23, f: 0 });

  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      if (now - last >= 1000 / 24) {
        last = now;
        const fc = frameRef.current;
        fc.f++;
        if (fc.f >= 24) { fc.f = 0; fc.s++; }
        if (fc.s >= 60) { fc.s = 0; fc.m++; }
        if (fc.m >= 60) { fc.m = 0; fc.h++; }
        setTimecode(
          `${String(fc.h).padStart(2,"0")}:${String(fc.m).padStart(2,"0")}:${String(fc.s).padStart(2,"0")}:${String(fc.f).padStart(2,"0")}`
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden hidden sm:block">
      
      {/* Left Edge: Metadata */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-faint">
        <span>ISO 800</span>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span>F/2.8</span>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span>24 FPS</span>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span>4K DCI</span>
      </div>

      {/* Right Edge: Timecode & REC */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-faint">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span>REC</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span className="tabular-nums font-mono">
          {timecode}
        </span>
      </div>

    </div>
  );
}
