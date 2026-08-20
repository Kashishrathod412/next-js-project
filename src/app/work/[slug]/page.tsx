"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { ArrowLeft, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyProps {
  params: {
    slug: string;
  };
}

export default function CaseStudyPage({ params }: CaseStudyProps) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // 1. Instant animation on mount for top header details & marker
    const details = containerRef.current.querySelector(".case-study-details");
    const marker6 = containerRef.current.querySelector(".scene-6-marker");

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (marker6) {
      tl.fromTo(marker6,
        { opacity: 0, y: 15 },
        { opacity: 0.35, y: 0, duration: 0.8 }
      );
    }

    if (details) {
      tl.fromTo(details,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4
        },
        "-=0.6" // slight stagger overlap
      );
    }

    // 2. Scroll-triggered animation for BTS grid further down the page
    const bts = containerRef.current.querySelector("#bts-grid");
    if (bts) {
      const btsTween = gsap.fromTo(bts,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bts,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (btsTween.scrollTrigger) triggers.push(btsTween.scrollTrigger);
    }

    // 3. Scroll-triggered animation for Scene 7 marker
    const marker7 = containerRef.current.querySelector(".scene-7-marker");
    if (marker7) {
      const marker7Tween = gsap.fromTo(marker7,
        { opacity: 0, y: 15 },
        {
          opacity: 0.35,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bts || containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
      if (marker7Tween.scrollTrigger) triggers.push(marker7Tween.scrollTrigger);
    }

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [project]);

  if (!project) {
    notFound();
  }

  return (
    <main id="case-study-top" ref={containerRef} className="min-h-screen bg-bg text-text pt-20 sm:pt-24 pb-32 relative overflow-hidden">
      {/* Subtle Editorial Detail Label */}
      <div className="absolute top-8 right-8 text-[9px] uppercase tracking-[0.25em] text-muted/20 font-mono z-10 select-none hidden sm:block">
        ROLL 02
      </div>
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none hidden sm:block">
        CUT 003
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12">
        {/* Back Button */}
        <div className="mb-8 relative z-50">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-muted hover:text-text transition-colors bg-surface/50 backdrop-blur-sm border border-stroke rounded-full px-4 py-2.5 min-h-[44px] w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Work
          </Link>
        </div>
        <div className="case-study-details">
          {/* Screenplay Scene Marker */}
          <div className="scene-6-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
            <span>SCENE 06</span>
            <span className="w-1 h-1 rounded-full bg-purple-500/50" />
            <span>CASE STUDY</span>
          </div>

          {/* Case Study Header */}
          <header className="mb-12 md:mb-16">
            <h1 className="text-[clamp(32px,6vw,72px)] leading-[1.05] tracking-tight font-medium text-text mb-4">
              {project.name}
            </h1>
            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-xs uppercase tracking-[0.06em] text-faint">
              <span>{project.category}</span>
              <span>{project.year}</span>
              <span>Client: {project.client}</span>
            </div>
          </header>

          {/* Hero Video/Image Placeholder */}
          <div className="w-full aspect-video bg-black border border-stroke rounded-xl overflow-hidden relative mb-16 flex items-center justify-center group">
            {project.video ? (
              <video 
                ref={videoRef}
                src={project.video}
                poster={`/posters/${project.slug}.jpg`}
                playsInline
                preload="none"
                controls={isPlaying}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="absolute inset-0 w-full h-full object-contain"
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: project.pattern }} />
            )}

            {!isPlaying && (
              <div 
                className="absolute inset-0 cursor-pointer flex items-center justify-center z-10"
                onClick={togglePlay}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 md:gap-16 mb-24">
            {/* Left: Notes */}
            <div>
              <h2 className="text-[11px] uppercase tracking-widest text-faint border-b border-stroke pb-2 mb-6">
                {"Director's Notes"}
              </h2>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-muted whitespace-pre-wrap">
                {project.directorNotes}
              </p>
            </div>

            {/* Right: Meta & Gear */}
            <div className="border-t border-stroke pt-8 md:border-0 md:pt-0">
              <div className="mb-10">
                <h2 className="text-[11px] uppercase tracking-widest text-faint border-b border-stroke pb-2 mb-4">
                  Role
                </h2>
                <p className="text-[13px] text-text/80">{project.role}</p>
              </div>

              <div>
                <h2 className="text-[11px] uppercase tracking-widest text-faint border-b border-stroke pb-2 mb-4">
                  Gear Used
                </h2>
                <ul className="flex flex-col gap-2">
                  {project.gear.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <div className="w-1 h-1 bg-ghost rounded-full" />
                      <span className="text-[12px] text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Behind The Scenes Staggered Grid */}
        <div id="bts-grid">
          {/* Screenplay Scene Marker */}
          <div className="scene-7-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
            <span>SCENE 07</span>
            <span className="w-1 h-1 rounded-full bg-purple-500/50" />
            <span>BEHIND THE SCENES</span>
          </div>

          <h2 className="text-[11px] uppercase tracking-widest text-faint border-b border-stroke pb-2 mb-8">
            Behind The Scenes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <div className="aspect-[4/5] bg-surface border border-stroke rounded-lg relative overflow-hidden">
               <img src="https://picsum.photos/seed/filmmaking1/800/1000" alt="Behind the scenes 1" className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <div className="aspect-square bg-surface border border-stroke rounded-lg relative overflow-hidden md:mt-8">
               <img src="https://picsum.photos/seed/filmmaking2/1000/1000" alt="Behind the scenes 2" className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <div className="aspect-video bg-surface border border-stroke rounded-lg relative overflow-hidden md:mt-16 col-span-2 md:col-span-1">
               <img src="https://picsum.photos/seed/filmmaking3/1200/800" alt="Behind the scenes 3" className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
