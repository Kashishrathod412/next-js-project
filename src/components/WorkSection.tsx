"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PROJECTS } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;

    const grid = containerRef.current.querySelector(".work-grid");
    const marker = containerRef.current.querySelector(".scene-marker");
    const isWorkPage = pathname === "/work";

    // Track only THIS component's ScrollTriggers so we don't nuke TimelineHUD's
    const triggers: ScrollTrigger[] = [];

    if (isWorkPage) {
      // On /work page: instant reveal, no blur delay — content should feel immediate
      gsap.set(grid, { opacity: 1, y: 0 });
      gsap.set(marker, { opacity: 0.35, y: 0 });

      // Subtle fade-up only (no blur), short duration
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (marker) {
        tl.fromTo(marker,
          { opacity: 0, y: 10 },
          { opacity: 0.35, y: 0, duration: 0.4 }
        );
      }

      if (grid) {
        tl.fromTo(grid,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );
      }
    } else {
      // On home page: ScrollTriggered with blur (fine here since user scrolls to it)
      if (grid) {
        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.fromTo(grid,
              { y: 30, opacity: 0.7 },
              { y: 0, opacity: 1, duration: 1.0, ease: "power2.out" }
            );
          }
        });
        triggers.push(st);
      }

      if (marker) {
        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.fromTo(marker,
              { opacity: 0, y: 15 },
              { opacity: 0.35, y: 0, duration: 0.8, ease: "power2.out" }
            );
          }
        });
        triggers.push(st);
      }
    }

    // Only kill THIS component's triggers — never all triggers globally
    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [pathname]);

  const displayProjects = PROJECTS.slice(0, 3);

  return (
    <section id="work-list" ref={containerRef} className="py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      
      {/* Editorial Easter Egg */}
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        SEQ D
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
          <span>SCENE 04</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>SELECTED WORK</span>
        </div>

        <div className="flex justify-between items-baseline mb-10 gap-4 min-w-0">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Selected work
          </h2>
          <span className="text-[10px] text-ghost">
            {displayProjects.length < 10 ? `0${displayProjects.length}` : displayProjects.length} projects
          </span>
        </div>

        <div className="work-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayProjects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              prefetch={true}
              className="work-card group bg-surface border border-stroke rounded-lg overflow-hidden cursor-pointer transition-colors duration-200 hover:border-white/20 block"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-raised relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#111]" />
                {project.poster && (
                  <Image 
                    src={project.poster} 
                    alt={project.name} 
                    fill
                    className="object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-300" 
                  />
                )}
                

                
                <span className="z-10 text-[9px] uppercase tracking-wider text-faint mix-blend-difference drop-shadow-md">
                  {project.category.split("·")[0].trim()}
                </span>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5 drop-shadow-md" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-3 pt-2 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-[13px] text-text/80 font-medium leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-[10px] text-faint mt-0.5">
                    {project.category}
                  </p>
                </div>
                <span className="text-[10px] text-ghost">{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}