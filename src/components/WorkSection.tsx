"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ProjectData } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

function WorkCard({ project }: { project: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="work-card group bg-surface border border-stroke rounded-lg overflow-hidden cursor-pointer transition-colors duration-200 hover:border-white/20 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlay}
    >
      {/* Thumbnail */}
      <div className={`${project.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-[9/16] md:aspect-[4/3]'} bg-raised relative flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-[#111]" />
        
        {project.video_url || project.video ? (
          <video
            ref={videoRef}
            src={project.video_url || project.video}
            playsInline
            loop
            controls={isPlaying}
            onClick={(e) => {
              if (isPlaying) e.stopPropagation();
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100 z-30 bg-black pointer-events-auto' : 'opacity-60 pointer-events-none'}`}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        ) : (
          (project.poster) && (
            <Image 
              src={project.poster} 
              alt={project.caption || project.name} 
              fill
              className="object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-300" 
            />
          )
        )}
        
        <span className={`z-10 text-[9px] uppercase tracking-wider text-faint mix-blend-difference drop-shadow-md transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          {project.category?.split("·")[0].trim() || 'VIDEO'}
        </span>
        
        {!isPlaying && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Play className="w-5 h-5 text-white fill-white ml-0.5 drop-shadow-md" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2 pb-3 flex justify-between items-start">
        <div>
          <h3 className="text-[13px] text-text/80 font-medium leading-snug line-clamp-1">
            {project.caption || project.name || 'Untitled'}
          </h3>
          <p className="text-[10px] text-faint mt-0.5">
            {project.category}
          </p>
        </div>
        <span className="text-[10px] text-ghost">
          {project.created_at ? new Date(project.created_at).getFullYear() : project.year}
        </span>
      </div>
    </div>
  );
}

interface WorkSectionProps {
  title: string;
  projects: ProjectData[];
  sceneNumber: string;
}

export default function WorkSection({ title, projects, sceneNumber }: WorkSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;

    const grid = containerRef.current.querySelector(".work-grid");
    const marker = containerRef.current.querySelector(".scene-marker");
    const isWorkPage = pathname === "/work";

    const triggers: ScrollTrigger[] = [];

    if (isWorkPage) {
      gsap.set(grid, { opacity: 1, y: 0 });
      gsap.set(marker, { opacity: 0.35, y: 0 });

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

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [pathname]);

  if (projects.length === 0) return null;

  return (
    <section id={`work-list-${title.toLowerCase()}`} ref={containerRef} className="py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      
      {/* Editorial Easter Egg */}
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        SEQ D
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
          <span>{sceneNumber}</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>{title.toUpperCase()}</span>
        </div>

        <div className="flex justify-between items-baseline mb-10 gap-4 min-w-0">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            {title}
          </h2>
          <span className="text-[10px] text-ghost">
            {projects.length < 10 ? `0${projects.length}` : projects.length} projects
          </span>
        </div>

        <div className="work-grid flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-10 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {projects.map((project) => (
            <div key={project.id} className="w-[60vw] sm:w-[50vw] md:w-[360px] shrink-0 snap-center">
              <WorkCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}