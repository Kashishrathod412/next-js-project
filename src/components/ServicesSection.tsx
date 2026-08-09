"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { Video, Film, MonitorPlay, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    name: "Wedding films",
    desc: "Full-day cinematic coverage.",
    price: "Starting ₹45,000",
    icon: Video,
  },
  {
    name: "Brand commercials",
    desc: "Concept to delivery.",
    price: "Starting ₹30,000",
    icon: Film,
  },
  {
    name: "Music videos",
    desc: "Narrative visuals + grade.",
    price: "Starting ₹20,000",
    icon: MonitorPlay,
  },
  {
    name: "Post-production",
    desc: "Edit, grade, titles, export.",
    price: "Starting ₹8,000",
    icon: Layers,
  },
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Parallax setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // Focus pull + fade in on grid
    const grid = containerRef.current.querySelector(".services-grid");
    if (grid) {
      gsap.set(grid, { willChange: "filter, transform" });
      const gridTween = gsap.fromTo(grid,
        {
          y: 30,
          opacity: 0.7,
          filter: "blur(8px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power2.out",
          onComplete: () => { (grid as HTMLElement).style.willChange = "auto"; },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (gridTween.scrollTrigger) triggers.push(gridTween.scrollTrigger);
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
    <section id="services" ref={containerRef} className="py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      
      {/* Editorial Easter Egg */}
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        SEQ B
      </div>
      
      {/* Parallax Background Photo Placeholder */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-5 grayscale"
        style={{ y: isMobile ? 0 : y }}
      >
        <div className="w-full h-[130%] absolute top-[-15%] left-0" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #151515 0 1px, transparent 1px 12px)" }}>
          <div className="absolute inset-0 flex items-center justify-center text-4xl uppercase tracking-widest text-faint mix-blend-overlay">
            [BTS PHOTO PLACEHOLDER 2]
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
          <span>SCENE 03</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>SERVICES</span>
        </div>

        <div className="flex justify-between items-baseline mb-10">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Services
          </h2>
          <span className="text-[10px] text-ghost">What I offer</span>
        </div>

      <div className="services-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <div
              key={i}
              className="service-card bg-surface border border-stroke rounded-lg p-4 sm:p-5 hover:border-white/20 transition-colors duration-200"
            >
              <div className="w-[34px] h-[34px] bg-raised border border-stroke/50 rounded-md flex items-center justify-center mb-4">
                <Icon className="w-[16px] h-[16px] text-faint" />
              </div>
              <h3 className="text-[14px] font-medium text-text/80">
                {service.name}
              </h3>
              <p className="text-[12px] text-muted leading-relaxed mt-1.5">
                {service.desc}
              </p>
              <div className="text-[11px] text-ghost border-t border-stroke pt-3 mt-4">
                {service.price}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
