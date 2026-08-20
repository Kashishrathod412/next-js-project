"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";


gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkCard({ project, isCenter, onClickCard }: { project: any, isCenter: boolean, onClickCard: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isCenter && isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isCenter, isPlaying]);

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

  const handleClick = () => {
    if (isCenter) {
      togglePlay();
    } else {
      onClickCard();
    }
  };

  return (
    <div
      className={`work-card group bg-surface border border-stroke rounded-lg overflow-hidden cursor-pointer transition-all duration-500 block ${isCenter ? 'opacity-100 scale-100 blur-none hover:border-white/20' : 'opacity-40 scale-[0.98] blur-[2px] pointer-events-auto hover:opacity-60'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className={`${project.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video md:aspect-[4/3]'} bg-raised relative flex items-center justify-center overflow-hidden transition-all duration-500`}>
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
        
        {!isPlaying && isCenter && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Play className="w-5 h-5 text-white fill-white ml-0.5 drop-shadow-md" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`px-3 pt-2 pb-3 flex justify-between items-start transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
        <div>
          <h3 className="text-[13px] text-text/80 font-medium leading-snug line-clamp-1">
            {project.caption || project.name || 'Untitled'}
          </h3>
          <p className="text-[10px] text-faint mt-0.5">
            {project.category}
          </p>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function WorkSection({ title, projects, sceneNumber }: { title: string; projects: any[]; sceneNumber: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const grid = containerRef.current.querySelector(".work-grid-anim");
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

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerCenter = container.scrollLeft + (container.clientWidth / 2);
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    // Convert children to array and filter out spacers (empty divs)
    const cardElements = Array.from(container.children).filter(child => child.classList.contains('card-wrapper'));
    
    cardElements.forEach((child: Element, index) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetLeft + (htmlChild.offsetWidth / 2);
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardElements = Array.from(container.children).filter(child => child.classList.contains('card-wrapper'));
    const child = cardElements[index] as HTMLElement;
    if (!child) return;
    
    const containerCenter = container.clientWidth / 2;
    const childCenter = child.offsetLeft + (child.offsetWidth / 2);
    
    container.scrollTo({
      left: childCenter - containerCenter,
      behavior: 'smooth'
    });
  };

  const scrollPrev = () => {
    if (activeIndex > 0) scrollToCard(activeIndex - 1);
  };

  const scrollNext = () => {
    if (activeIndex < projects.length - 1) scrollToCard(activeIndex + 1);
  };

  if (projects.length === 0) return null;

  return (
    <section id={`work-list-${title.toLowerCase()}`} ref={containerRef} className="py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      
      {/* Editorial Easter Egg */}
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        SEQ D
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto work-grid-anim">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
          <span>{sceneNumber}</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>{title.toUpperCase()}</span>
        </div>

        <div className="flex justify-between items-baseline mb-8 gap-4 min-w-0">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted flex items-center gap-4">
            {title}
          </h2>
          <span className="text-[10px] text-ghost flex items-center gap-3">
            {projects.length < 10 ? `0${projects.length}` : projects.length} projects
          </span>
        </div>
        
        <div className="relative w-full group/carousel">
          {/* Glowing Navigation Buttons */}
          <button 
            onClick={scrollPrev} 
            disabled={activeIndex === 0} 
            className="absolute left-2 sm:left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/60 border border-white/20 backdrop-blur-xl text-white transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none opacity-80 sm:opacity-50 sm:group-hover/carousel:opacity-100 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </button>
          
          <button 
            onClick={scrollNext} 
            disabled={activeIndex === projects.length - 1} 
            className="absolute right-2 sm:right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/60 border border-white/20 backdrop-blur-xl text-white transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none opacity-80 sm:opacity-50 sm:group-hover/carousel:opacity-100 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </button>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-10 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar items-center"
        >
          {/* Spacer to allow first item to center */}
          <div className="w-[10vw] sm:w-[20vw] md:w-[calc(50%-180px)] shrink-0 pointer-events-none" />
          
          {projects.map((project, index) => (
            <div key={project.id} className={`card-wrapper shrink-0 snap-center transition-all duration-500 ${project.orientation === 'vertical' ? 'w-[55vw] sm:w-[40vw] md:w-[240px]' : 'w-[70vw] sm:w-[50vw] md:w-[360px]'}`}>
              <WorkCard project={project} isCenter={activeIndex === index} onClickCard={() => scrollToCard(index)} />
            </div>
          ))}
          
          {/* Spacer to allow last item to center */}
          <div className="w-[10vw] sm:w-[20vw] md:w-[calc(50%-180px)] shrink-0 pointer-events-none" />
        </div>
        </div>
      </div>
    </section>
  );
}