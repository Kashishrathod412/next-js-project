"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Play, X, Volume2, VolumeX, Maximize } from "lucide-react";

const CanvasParticles = dynamic(() => import("./CanvasParticles"), { ssr: false });
const CursorGlow = dynamic(() => import("./CursorGlow"), { ssr: false });

// Magnetic Button Component
function MagneticButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<{left: number, top: number, width: number, height: number} | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseEnter = () => {
    if (ref.current) {
      boundsRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!boundsRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = boundsRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    boundsRef.current = null;
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block relative"
      onClick={onClick}
    >
      <div className={className}>{children}</div>
    </motion.div>
  );
}

// Stats Counter Component
function AnimatedStat({ target, suffix, label }: { target: number, suffix: string, label: string }) {
  return (
    <div className="hero-stat-item opacity-0 translate-y-4">
      <div className="text-2xl md:text-3xl font-medium text-text mb-1 tracking-tight flex items-baseline">
        <span>{target}</span>
        <span>{suffix}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted max-w-[90px] leading-snug">{label}</div>
    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSection({ initialReels = [] }: { initialReels?: any[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeCategory, setActiveCategory] = useState("ALL");

  const [isMuted, setIsMuted] = useState(true);
  const [isSpread, setIsSpread] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter reels (using the dynamic data)
  const filteredReels = initialReels.filter(r => activeCategory === "ALL" || (r.category && r.category.toUpperCase().includes(activeCategory))).slice(0, 5);

  // Mouse Parallax for 3D Stack
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-500, 500], [8, -8]);
  const rotateY = useTransform(springX, [-500, 500], [-8, 8]);

  const [centerOffset, setCenterOffset] = useState(0);

  useEffect(() => {
    const updateOffset = () => {
      if (typeof window !== 'undefined' && containerRef.current) {
        const rightSide = containerRef.current.querySelector('.perspective-\\[1200px\\]');
        if (rightSide) {
          const rect = rightSide.getBoundingClientRect();
          const rightSideCenter = rect.left + rect.width / 2;
          const screenCenter = window.innerWidth / 2;
          setCenterOffset(screenCenter - rightSideCenter);
        }
      }
    };
    
    // Initial calculation after a small delay to ensure layout is complete
    setTimeout(updateOffset, 100);
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth < 768) return; // Disable parallax on mobile devices to improve performance and battery life
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Video playback control
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeCardIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeCardIndex]);

  // GSAP Entry
  useEffect(() => {
    if (!containerRef.current) return;
    const content = containerRef.current.querySelector(".hero-content-left");
    const words = containerRef.current.querySelectorAll(".hero-word");
    const stats = containerRef.current.querySelectorAll(".hero-stat-item");
    const btns = containerRef.current.querySelectorAll(".hero-btn-container");

    const tl = gsap.timeline({ delay: 0.4 });

    if (content) tl.to(content, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0);
    if (words.length) tl.to(words, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 }, "-=0.5");
    if (btns.length) tl.fromTo(btns, 
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 }, 
      "-=0.5"
    );
    if (stats.length) tl.to(stats, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 }, "-=0.5");

    return () => { tl.kill(); };
  }, []);

  return (
    <>
      <CursorGlow />
      <section
        id="hero"
        ref={containerRef}
        className="relative min-h-[100dvh] w-full overflow-hidden bg-bg pt-28 md:pt-32 lg:pt-36 pb-24"
      >

        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-bg via-bg/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-bg pointer-events-none" />
        
        {/* Depth Layers / Glows */}
        <motion.div 
          style={{ x: useTransform(mouseX, [-500, 500], [-20, 20]), y: useTransform(mouseY, [-500, 500], [-20, 20]) }}
          className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-[#8b5cf6] blur-[120px] opacity-10 rounded-full pointer-events-none z-[1]" 
        />
        <motion.div 
          style={{ x: useTransform(mouseX, [-500, 500], [30, -30]), y: useTransform(mouseY, [-500, 500], [30, -30]) }}
          className="absolute bottom-[10%] left-[20%] w-[600px] h-[400px] bg-[#8b5cf6] blur-[140px] opacity-[0.08] rounded-full pointer-events-none z-[1]" 
        />

        <CanvasParticles />

        {/* Film Grain */}
        <div 
          className="absolute inset-0 z-[3] opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Active state dimmer */}
        <AnimatePresence>
          {(activeCardIndex !== null || isSpread) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-black/90 z-[40]"
              onClick={() => { setActiveCardIndex(null); setIsSpread(false); }}
            />
          )}
        </AnimatePresence>

        <div className="relative max-w-[1440px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-center">
          
          {/* LEFT SIDE (40%) */}
          <div 
            className="hero-content-left w-full lg:w-[45%] flex flex-col justify-center pt-8 lg:pt-0 z-20 pointer-events-none"
            style={{ opacity: 0, willChange: "opacity" }}
          >
            <div className="hero-word text-[10px] uppercase tracking-[0.2em] text-muted mb-6 inline-block translate-y-4 opacity-0 font-medium">
              Videographer & Editor
            </div>

            <h1 className="text-[clamp(44px,6vw,84px)] font-medium leading-[1.0] tracking-tight mb-8">
              <div className="overflow-hidden">
                <span className="hero-word inline-block opacity-0 translate-y-8 text-text">
                  Frames that
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="hero-word inline-block opacity-0 translate-y-8 font-display italic text-text/80 pr-4">
                  move people.
                </span>
              </div>
            </h1>

            <div className="overflow-hidden mb-12">
              <p className="hero-word text-sm md:text-base text-muted max-w-[85%] leading-relaxed opacity-0 translate-y-6">
                Crafting cinematic stories for brands, creators, and businesses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 lg:mb-20 pointer-events-auto">
              <div className="hero-btn-container opacity-0 hidden sm:block">
                <MagneticButton>
                  <div 
                    onClick={() => setIsSpread(true)}
                    className="bg-white text-black text-[12px] font-semibold uppercase tracking-[0.1em] px-8 py-4 rounded-full hover:scale-105 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-white/10"
                  >
                    Watch Showreel <span className="text-[14px]">→</span>
                  </div>
                </MagneticButton>
              </div>
              
              <div className="hero-btn-container opacity-0">
                <MagneticButton>
                  <Link href="/work" className="border border-white/15 bg-white/5 backdrop-blur-md text-text text-[12px] font-medium uppercase tracking-[0.1em] px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center cursor-pointer">
                    View Projects
                  </Link>
                </MagneticButton>
              </div>
            </div>

            <div className="flex flex-row justify-between w-full sm:w-auto sm:justify-start sm:gap-12 pointer-events-auto">
              <AnimatedStat target={120} suffix="+" label="Projects Delivered" />
              <AnimatedStat target={6} suffix="+" label="Years Experience" />
            </div>
          </div>

          {/* RIGHT SIDE (60%) - Floating Deck & Filters */}
          <div className="w-full lg:w-[55%] min-h-[550px] md:min-h-[650px] mt-16 lg:mt-8 relative flex flex-col items-center justify-center perspective-[1200px] z-[50]">
            


            <motion.div 
              style={{ rotateX, rotateY, willChange: "transform" }}
              className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[9/16] preserve-3d"
            >
              <AnimatePresence>
                {filteredReels.map((reel, index) => {
                  const isActive = activeCardIndex === index;
                  const isHovered = hoveredCardIndex === index;
                  const isAnotherActive = activeCardIndex !== null && !isActive;
                  
                  // Stack positioning
                  const stackDepth = index * 45;
                  const stackY = index * 25;
                  const stackScale = 1 - (index * 0.05);

                  // Spread positioning
                  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
                  // On desktop: wide horizontal fan. On mobile: diagonal cascade to fit narrow screens perfectly.
                  const spreadX = isMobile ? (index - 2) * 35 : (index - 2) * 160; 
                  const spreadY = isMobile ? (index - 2) * 45 : Math.abs(index - 2) * 20; 
                  const spreadRotate = isMobile ? (index - 2) * -4 : (index - 2) * 8; 
                  const spreadZ = index * 10;

                  return (
                    <motion.div
                      key={reel.id}
                      className={`absolute inset-0 rounded-[28px] overflow-hidden cursor-pointer shadow-2xl transition-colors duration-300`}
                      style={{
                        background: "rgba(20, 20, 20, 0.95)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        zIndex: isActive ? 100 : isSpread ? 60 + index : 50 - index,
                        willChange: "transform, filter",
                      }}
                      initial={{ opacity: 0, y: 150, scale: 0.8, rotateZ: (index % 2 === 0 ? 4 : -4) }}
                      animate={{ 
                        opacity: isAnotherActive ? 0 : 1,
                        z: isActive ? 300 : isSpread ? spreadZ : -stackDepth,
                        y: isActive ? 0 : isSpread ? spreadY : stackY,
                        x: isActive ? (typeof window !== "undefined" && window.innerWidth >= 1024 ? centerOffset : 0) : isSpread ? spreadX : 0,
                        scale: isActive ? 1.2 : isHovered && !isSpread ? stackScale * 1.05 : isSpread ? 0.9 : stackScale,
                        rotateZ: isActive ? 0 : isSpread ? spreadRotate : index % 2 === 0 ? 2 : -2,
                        filter: isAnotherActive ? 'blur(10px) brightness(0.4)' : isHovered ? 'brightness(1.2)' : 'brightness(1)',
                      }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 18,
                        mass: 1.2,
                        opacity: { duration: 0.3 },
                        delay: isActive ? 0 : index * 0.05 
                      }}
                      onMouseEnter={() => setHoveredCardIndex(index)}
                      onMouseLeave={() => setHoveredCardIndex(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSpread && activeCardIndex === null) {
                          setIsSpread(true);
                        } else if (isSpread && !isActive) {
                          setActiveCardIndex(index);
                          const video = videoRefs.current[index];
                          if (video) video.play().catch(console.error);
                          
                          // Pause others
                          videoRefs.current.forEach((v, i) => {
                            if (i !== index && v) v.pause();
                          });
                        }
                      }}
                    >
                      <div className="absolute inset-0" style={{ background: '#111', opacity: 0.4 }} />
                      
                      {isMounted && (reel.video_url || reel.video) && (
                        <video
                          ref={el => { videoRefs.current[index] = el; }}
                          src={reel.video_url || reel.video}
                          poster={reel.poster}
                          preload="metadata"
                          autoPlay={isActive}
                          loop
                          muted={isActive ? isMuted : true}
                          playsInline
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-105'}`}
                        />
                      )}

                      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`} />

                      {/* Card UI Overlay (Thumbnail) */}
                      {!isActive && (
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            </div>
                            <span className="text-white/90 text-xs font-medium tracking-wide drop-shadow-md line-clamp-1">
                              {reel.caption || reel.name || 'Untitled'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium text-lg mb-1 leading-tight drop-shadow-md">{reel.category}</h3>
                          </div>
                        </div>
                      )}

                      {/* Active Video Controls & Close */}
                      {isActive && (
                        <>
                          <div 
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-black/80 z-[60] text-white transition-colors border border-white/10"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveCardIndex(null); 
                              const video = videoRefs.current[index];
                              if (video) video.pause();
                            }}
                          >
                            <X className="w-5 h-5" />
                          </div>
                          
                          {/* Control Bar */}
                          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between z-[60]"
                               onClick={(e) => e.stopPropagation()}>
                            <div>
                              <div className="text-white font-medium text-sm line-clamp-1">{reel.caption || reel.name || 'Untitled'}</div>
                              <div className="text-white/60 text-[10px] uppercase tracking-widest mt-0.5">{reel.category}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                className="text-white/80 hover:text-white transition-colors"
                              >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </button>
                              <button className="text-white/80 hover:text-white transition-colors cursor-not-allowed">
                                <Maximize className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Outer Glow */}
                      {isHovered && !isActive && (
                        <div className="absolute -inset-4 bg-[#8b5cf6] opacity-20 blur-2xl -z-10 rounded-full pointer-events-none" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

