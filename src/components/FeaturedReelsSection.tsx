"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/data/projects";
import { Play } from "lucide-react";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Slice the first 3 for featured
const FEATURED = PROJECTS.slice(0, 3);

export default function FeaturedReelsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(".featured-item");
    
    // Create an array to track triggers
    const triggers: ScrollTrigger[] = [];

    items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const media = item.querySelector(".featured-media");
      const content = item.querySelector(".featured-content");

      if (media && content) {
        // Media slides in from the side it belongs to
        const st1 = ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse",
          animation: gsap.fromTo(media, 
            { x: isEven ? -50 : 50, opacity: 0, scale: 0.95 },
            { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
          )
        });
        triggers.push(st1);

        // Content fades up
        const st2 = ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse",
          animation: gsap.fromTo(content,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
          )
        });
        triggers.push(st2);
      }
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-bg border-t border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">Selected Works</h2>
          <h3 className="text-4xl md:text-6xl font-medium tracking-tight">Featured Reels</h3>
        </div>

        <div className="flex flex-col gap-32">
          {FEATURED.map((project, index) => {
            const isEven = index % 2 === 0;
            const isHovered = hoveredId === project.id;
            const isPlaying = playingId === project.id;
            
            return (
              <div 
                key={project.id} 
                className={`featured-item flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
              >
                {/* Media Side */}
                <div 
                  className="featured-media w-full lg:w-[55%] relative aspect-video rounded-[32px] overflow-hidden cursor-pointer border border-white/10 group shadow-2xl"
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    const v = videoRefs.current[project.id];
                    if (!v) return;
                    if (isPlaying) {
                      v.pause();
                      setPlayingId(null);
                    } else {
                      if (playingId !== null && videoRefs.current[playingId]) {
                        videoRefs.current[playingId]?.pause();
                      }
                      v.play().catch(() => {});
                      setPlayingId(project.id);
                    }
                  }}
                >
                  <div className="absolute inset-0" style={{ background: project.pattern, opacity: 0.5 }} />
                  
                  {project.video && (
                    <video
                      ref={el => { if (el) videoRefs.current[project.id] = el; }}
                      src={project.video}
                      muted
                      loop
                      playsInline
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered || isPlaying ? 'opacity-100 scale-100' : 'opacity-60 scale-105'}`}
                    />
                  )}

                  {/* Play Button Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-20 ${(isHovered && !isPlaying) ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-500 z-10">
                      <Play className="w-8 h-8 text-white fill-white ml-2 drop-shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="featured-content w-full lg:w-[45%] flex flex-col items-start">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b5cf6] mb-4 font-medium">
                    {project.category}
                  </div>
                  <h4 className="text-4xl md:text-5xl font-medium mb-6 leading-tight tracking-tight">
                    {project.name}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-8 w-full border-y border-white/10 py-6 mb-8">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-2">Client</div>
                      <div className="text-sm font-medium text-white/90">{project.client}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mb-2">Project Type</div>
                      <div className="text-sm font-medium text-white/90">{project.role}</div>
                    </div>
                  </div>

                  <p className="text-muted leading-relaxed text-sm md:text-base mb-10">
                    {project.directorNotes}
                  </p>

                  <button className="bg-white/5 border border-white/10 text-white text-xs uppercase tracking-[0.1em] px-8 py-4 rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg font-medium">
                    Watch Reel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
