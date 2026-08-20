/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Camera, 
  Scissors, 
  Palette, 
  AudioWaveform
} from "lucide-react";
import NeonBorder from "./NeonBorder";
import VaporizeTextCycle from "./VaporizeTextCycle";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "120+", label: "Projects" },
  { value: "6", label: "Years" },
];

const SKILLS = [
  { name: "Cinematography", icon: Camera },
  { name: "Editing", icon: Scissors },
  { name: "Colour grade", icon: Palette },
  { name: "Sound design", icon: AudioWaveform },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [delthaFont, setDelthaFont] = useState("sans-serif");
  const dummyFontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    if (dummyFontRef.current) {
      setDelthaFont(window.getComputedStyle(dummyFontRef.current).fontFamily);
    }
  }, []);

  // Parallax setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const triggers: ScrollTrigger[] = [];

    const contentDiv = sectionRef.current.querySelector('.about-content');
    if (contentDiv) {
      const isMobileDevice = window.innerWidth < 768;
      gsap.set(contentDiv, { willChange: "transform, opacity" });
      const contentTween = gsap.fromTo(contentDiv,
        { 
          y: 30, 
          opacity: 0.7, 
          filter: isMobileDevice ? "none" : "blur(8px)" 
        },
        {
          y: 0,
          opacity: 1,
          filter: isMobileDevice ? "none" : "blur(0px)",
          duration: 1.0,
          ease: "power2.out",
          onComplete: () => { (contentDiv as HTMLElement).style.willChange = "auto"; },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (contentTween.scrollTrigger) triggers.push(contentTween.scrollTrigger);
    }

    const markerDiv = sectionRef.current.querySelector('.scene-marker');
    if (markerDiv) {
      const markerTween = gsap.fromTo(markerDiv,
        { opacity: 0, y: 15 },
        {
          opacity: 0.35,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
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
    <section id="about" ref={sectionRef} className="py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      
      {/* Editorial Easter Egg */}
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        CUT 001 // TAKE 03
      </div>
      
      {/* Parallax Background Photo Placeholder */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-5 grayscale"
        style={isMobile ? {} : { y }}
      >
        <div className="w-full h-[140%] absolute top-[-20%] left-0">
          <img 
            src="/bts-bg.png" 
            alt="BTS Background" 
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async" 
          />
        </div>
      </motion.div>

      <div className="about-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20 items-center relative z-10 max-w-[1200px] mx-auto">
        
        {/* Left Column: Profile Photo */}
        <div className="w-full aspect-[4/5] relative group rounded-2xl">
          <div className="absolute inset-0 z-20 pointer-events-none">
            <NeonBorder color="#8b5cf6" rounded={16} thickness={2} borderSize={40} glow={70} />
          </div>
          <div className="w-full h-full rounded-2xl relative z-10 overflow-hidden bg-surface">
            <img 
              src="/dhruvil img.webp" 
              alt="My Profile" 
              className="w-full h-full object-cover transition-all duration-700"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>


        {/* Right Column: Content */}
        <div>
          {/* Screenplay Scene Marker */}
          <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
            <span>SCENE 02</span>
            <span className="w-1 h-1 rounded-full bg-purple-500/50" />
            <span>THE STORY</span>
          </div>

          <p className="text-[10px] uppercase tracking-[0.12em] text-faint mb-4 font-sans">
            About Me
          </p>
          <div ref={dummyFontRef} className="font-deltha hidden" />
          <div className="h-[40px] md:h-[48px] w-full mb-2 z-10 relative">
            <VaporizeTextCycle 
              texts={["Filmmaker", "Editor", "Dhruvil Naidu"]} 
              loop={false}
              font={{ 
                fontFamily: delthaFont, 
                fontWeight: 600, 
                fontSize: isMobile ? 32 : 44 
              }}
              alignment="left"
              color="#ededed"
              spread={15}
            />
          </div>
          <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-text/90 mb-6">
            6 years behind the{" "}
            <em className="font-display italic text-text font-normal">lens.</em>
          </h3>
          <div className="text-[14px] text-muted leading-relaxed max-w-lg mb-10 space-y-4 font-equinox tracking-normal">
            <p>
              I am a passionate filmmaker, cinematographer, and editor dedicated to crafting visual stories that leave a lasting impact. My journey began with a fascination for how light, shadow, and movement can evoke deep emotions and tell compelling narratives.
            </p>
            <p>
              Over the last six years, I&apos;ve had the privilege of shooting and editing for a diverse range of clients, from commercial campaigns to intimate documentaries. I obsess over pacing, cinematic color grading, and finding the raw beauty in the moments between moments. Always ready to travel and bring unique visions to life, frame by frame.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-full mb-12">
            {STATS.map((stat, i) => (
              <div key={i} className="border-t border-stroke pt-3">
                <div className="text-3xl sm:text-4xl font-medium text-text">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-faint mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SKILLS.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <div
                  key={i}
                  className="bg-surface/80 backdrop-blur-sm border border-stroke rounded-md px-3 h-8 text-xs text-muted flex items-center gap-3"
                >
                  <Icon className="w-[14px] h-[14px] text-faint" />
                  {skill.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
