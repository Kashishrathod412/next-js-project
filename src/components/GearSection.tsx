"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GEAR = [
  {
    title: "Cameras",
    items: ["Sony FX3", "Sony A7 IV", "DJI Pocket 3", "GoPro Hero 12"],
  },
  {
    title: "Lenses",
    items: [
      "Sony 24–70 f/2.8",
      "Sony 85mm f/1.4",
      "Sigma 18–35 f/1.8",
      "Voigtländer 40mm",
    ],
  },
  {
    title: "Support & post",
    items: [
      "DJI RS 3 Pro",
      "DJI Mini 4 Pro",
      "DaVinci Resolve",
      "Adobe Premiere Pro",
    ],
  },
];

export default function GearSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // Focus pull + fade in on gear grid
    const content = containerRef.current.querySelector(".gear-content");
    if (content) {
      gsap.set(content, { willChange: "filter, transform" });
      const contentTween = gsap.fromTo(content,
        {
          y: 30,
          opacity: 0.7,
          filter: "blur(8px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power2.out",
          onComplete: () => { (content as HTMLElement).style.willChange = "auto"; },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (contentTween.scrollTrigger) triggers.push(contentTween.scrollTrigger);
    }

    // Fade in scene marker
    const marker = containerRef.current.querySelector(".scene-marker");
    if (marker) {
      const markerTween = gsap.fromTo(marker,
        { opacity: 0, y: 15 },
        {
          opacity: 0.35,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (markerTween.scrollTrigger) triggers.push(markerTween.scrollTrigger);
    }

    return () => { triggers.forEach(t => t.kill()); };
  }, []);

  return (
    <section id="gear" ref={containerRef} className="py-16 px-4 sm:px-6 md:px-12 border-t border-stroke relative overflow-hidden">
      
      {/* Editorial Easter Egg */}
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        ROLL 04
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto gear-content">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-white select-none">
          <span>SCENE 04</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>EQUIPMENT</span>
        </div>

        <div className="flex justify-between items-baseline mb-10">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-white">
            Gear list
          </h2>
          <span className="text-[10px] text-white">My kit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-3">
          {GEAR.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] uppercase tracking-wider sm:tracking-widest text-white border-b border-stroke pb-2 mb-3">
                {group.title}
              </h3>
              <ul className="flex flex-col">
                {group.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 py-2 border-b border-stroke/50 last:border-0"
                  >
                    <div className="w-[4px] h-[4px] bg-white rounded-full shrink-0" />
                    <span className="text-[12px] text-white drop-shadow-md">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

