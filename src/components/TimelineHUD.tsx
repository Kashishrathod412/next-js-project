"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

// Formats a raw frame count at 24fps to HH:MM:SS:FF
const formatFramesToTimecode = (totalFrames: number) => {
  const roundedFrames = Math.max(0, Math.floor(totalFrames));
  const fps = 24;
  const ff = roundedFrames % fps;
  const totalSeconds = Math.floor(roundedFrames / fps);
  const ss = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const mm = totalMinutes % 60;
  const hh = Math.floor(totalMinutes / 60);

  return `${hh.toString().padStart(2, "0")}:${mm
    .toString()
    .padStart(2, "0")}:${ss.toString().padStart(2, "0")}:${ff
    .toString()
    .padStart(2, "0")}`;
};

export default function TimelineHUD() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const offsetsRef = useRef({
    about: 0,
    contact: 0,
    bts: 0,
    workSections: [0, 0, 0, 0],
    maxScroll: 1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scene definitions per route
  const getScenesForRoute = () => {
    if (pathname === "/") {
      return [
        { id: "hero", label: "01 HOME" },
        { id: "about", label: "02 ABOUT" },
        { id: "contact", label: "03 CONTACT" },
      ];
    } else if (pathname === "/work") {
      return [
        { id: "work-list-fashion & events", label: "01 FASHION" },
        { id: "work-list-food & beverage", label: "02 FOOD" },
        { id: "work-list-automotive", label: "03 AUTO" },
        { id: "work-list-commercial & brand", label: "04 BRAND" },
      ];
    } else if (pathname.startsWith("/work/")) {
      return [
        { id: "case-study-top", label: "01 FILM" },
        { id: "bts-grid", label: "02 BTS" },
      ];
    }
    return [];
  };

  const scenes = getScenesForRoute();

  const getAbsoluteY = (id: string) => {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (!el) return 0;
    return el.getBoundingClientRect().top + window.scrollY;
  };

  // Measure offsets of elements on resize or route transition
  useEffect(() => {
    const measure = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      
      offsetsRef.current = {
        about: getAbsoluteY("about") || scrollMax * 0.25,
        contact: getAbsoluteY("contact") || scrollMax * 0.85,
        bts: getAbsoluteY("bts-grid") || scrollMax * 0.5,
        workSections: [
          getAbsoluteY("work-list-fashion & events") || 0,
          getAbsoluteY("work-list-food & beverage") || scrollMax * 0.25,
          getAbsoluteY("work-list-automotive") || scrollMax * 0.5,
          getAbsoluteY("work-list-commercial & brand") || scrollMax * 0.75,
        ],
        maxScroll: scrollMax > 0 ? scrollMax : 1,
      };
    };

    // Run measurement immediately and then after a brief delay
    // to account for dynamic contents loading
    measure();
    const timer = setTimeout(measure, 500);

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timer);
    };
  }, [pathname]);

  // Track scroll and calculate scrollProgress + timecode + active scene
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = offsetsRef.current.maxScroll;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;

      setScrollProgress(progress);

      let calculatedFrames = 0;
      let activeIdx = 0;
      const offsets = offsetsRef.current;

      if (pathname === "/") {
        // Homepage interpolation targets:
        // Hero top (y=0) -> 00:00:00:00 (0 frames)
        // About top (y=yAbout) -> 00:00:45:12 (1092 frames)
        // Contact top (y=yContact) -> 00:03:15:10 (4690 frames)
        // Page End (y=maxScroll) -> 00:03:30:00 (5040 frames)
        const fHero = 0;
        const fAbout = 1092;
        const fContact = 4690;
        const fEnd = 5040;

        if (y < offsets.about) {
          const ratio = offsets.about > 0 ? y / offsets.about : 0;
          calculatedFrames = fHero + ratio * (fAbout - fHero);
          activeIdx = 0;
        } else if (y < offsets.contact) {
          const ratio = (y - offsets.about) / (offsets.contact - offsets.about);
          calculatedFrames = fAbout + ratio * (fContact - fAbout);
          activeIdx = 1;
        } else {
          const ratio = maxScroll - offsets.contact > 0 ? (y - offsets.contact) / (maxScroll - offsets.contact) : 0;
          calculatedFrames = fContact + Math.min(1, ratio) * (fEnd - fContact);
          activeIdx = 2;
        }
      } else if (pathname === "/work") {
        const fWorkStart = 3474;
        const fWorkEnd = 4320;
        
        const ratio = maxScroll > 0 ? y / maxScroll : 0;
        calculatedFrames = fWorkStart + ratio * (fWorkEnd - fWorkStart);
        
        activeIdx = 0;
        for (let i = offsets.workSections.length - 1; i >= 0; i--) {
           if (y >= offsets.workSections[i] - 300) {
              activeIdx = i;
              break;
           }
        }
      } else if (pathname.startsWith("/work/")) {
        // Case Study Page:
        // Scroll progress maps from 00:03:30:00 (5040 frames) to 00:04:45:00 (6840 frames)
        // BTS top (y=yBts) -> 00:04:10:00 (6000 frames)
        const fBtsStart = 5040;
        const fGridStart = 6000;
        const fBtsEnd = 6840;

        if (y < offsets.bts) {
          const ratio = offsets.bts > 0 ? y / offsets.bts : 0;
          calculatedFrames = fBtsStart + ratio * (fGridStart - fBtsStart);
          activeIdx = 0;
        } else {
          const ratio = maxScroll - offsets.bts > 0 ? (y - offsets.bts) / (maxScroll - offsets.bts) : 0;
          calculatedFrames = fGridStart + Math.min(1, ratio) * (fBtsEnd - fGridStart);
          activeIdx = 1;
        }
      }

      setTimecode(formatFramesToTimecode(calculatedFrames));
      setActiveSceneIndex(activeIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Bottom wave animation bars
  const barCount = 50;

  if (!mounted) return null;

  return (
    <>
      {/* 1. Left Edge Metadata HUD Overlay */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-faint z-40 hidden sm:flex pointer-events-none select-none">
        <span>ISO 800</span>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span>F/2.8</span>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span>24 FPS</span>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span>4K DCI</span>
      </div>

      {/* 2. Right Edge Blinking REC HUD Overlay */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 rotate-90 origin-right flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-faint z-40 hidden sm:flex pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span>REC</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-stroke" />
        <span className="tabular-nums font-mono">
          {timecode}
        </span>
      </div>

      {/* 3. Bottom Video Timeline Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-45 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-stroke/80 px-3 py-2 md:px-6 md:py-4 lg:px-12 flex flex-col gap-3 select-none">
        {/* Subtle Waveform Animation Overlay */}
        <div className="absolute inset-x-0 bottom-0 top-0 hidden sm:flex items-center justify-around pointer-events-none opacity-[0.04] h-full px-6 overflow-hidden">
          {Array.from({ length: barCount }).map((_, i) => {
            const height = 14 + Math.sin(i * 0.15) * 8 + Math.random() * 4;
            const duration = 1.0 + Math.sin(i * 0.4) * 0.5 + Math.random() * 0.3;
            const delay = -Math.random() * 2;
            return (
              <div
                key={i}
                className="w-[1.5px] bg-white rounded-full origin-center"
                style={{
                  height: `${height}px`,
                  animation: `timelineWave ${duration}s ease-in-out ${delay}s infinite alternate`,
                  willChange: "transform",
                }}
              />
            );
          })}
        </div>

        {/* Timeline Header Row */}
        <div className="relative z-10 hidden sm:flex justify-between items-center text-[10px] uppercase tracking-[0.15em] text-faint">
          <div className="flex items-center gap-2">
            <span className="text-muted/80">VIDEO TIMELINE</span>
            <span className="text-stroke">|</span>
            <span className="font-mono text-faint/80">
              {scenes[activeSceneIndex]?.label || (pathname === "/" ? "SEQ_HOME" : pathname === "/work" ? "SEQ_WORK" : "SEQ_STUDY")}
            </span>
          </div>
          <div className="font-mono text-muted tracking-widest tabular-nums bg-[#111] px-2 py-0.5 border border-stroke rounded">
            {timecode}
          </div>
        </div>

        {/* Timeline Track with Playhead */}
        <div className="relative z-10 w-full py-1.5 flex items-center">
          <div className="w-full h-[2px] bg-stroke relative rounded-full">
            {/* Scene Markers on Track */}
            {scenes.map((scene, i) => {
              const maxScroll = offsetsRef.current?.maxScroll || 1;
              const absY = getAbsoluteY(scene.id);
              const percent = maxScroll > 0 ? (absY / maxScroll) * 100 : 0;
              
              if (percent === 0 && i !== 0) return null; // hide if not found
              
              return (
                <div 
                  key={`marker-${scene.id}`}
                  className="absolute top-1/2 -translate-y-1/2 w-[1px] h-[6px] bg-faint/60"
                  style={{ left: `${percent}%` }}
                />
              );
            })}

            {/* Playhead Track Progress Highlight */}
            <div 
              className="absolute left-0 top-0 h-full bg-purple-500/20"
              style={{ width: `${scrollProgress * 100}%` }}
            />
            {/* Playhead Indicator Dot */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] flex items-center justify-center cursor-pointer transition-transform duration-75 hover:scale-125 z-10"
              style={{ left: `calc(${scrollProgress * 100}% - 6px)` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Active Scene Highlights Row */}
        <div className="relative z-10 flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 timeline-scenes">
          <div className="flex items-center gap-6 md:gap-8">
            {scenes.map((scene, index) => {
              const isActive = index === activeSceneIndex;
              return (
                <div 
                  key={scene.id} 
                  onClick={() => {
                    if (scene.id === "hero") {
                      if (lenis) {
                        lenis.scrollTo(0, { duration: 1.2 });
                      } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      return;
                    }
                    const el = document.getElementById(scene.id);
                    if (el) {
                      if (lenis) {
                        lenis.scrollTo(el, { duration: 1.2, offset: -50 });
                      } else {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  className={`${isActive ? "flex" : "hidden sm:flex"} items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "text-purple-400 font-medium drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]" 
                      : "text-faint hover:text-muted"
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? "bg-purple-400 scale-125 shadow-[0_0_4px_rgba(139,92,246,0.6)]" : "bg-stroke"
                  }`} />
                  <span>{scene.label}</span>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block text-[8px] uppercase tracking-[0.15em] text-faint">
            TAKE 03 &bull; ROLL 07 &bull; 24.00 fps
          </div>
        </div>
      </div>
    </>
  );
}
