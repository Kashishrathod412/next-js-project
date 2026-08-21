"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, animate, useMotionValue } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { REELS } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function detectPlatform(url: string): "youtube" | "vimeo" | "local" | "unknown" {
  if (!url) return "unknown";
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url)) return "vimeo";
  if (url.startsWith("/") || url.startsWith("http")) return "local";
  return "unknown";
}

// ─── Slide renderers ──────────────────────────────────────────────────────────

function YouTubeSlide({ youtubeId, isActive }: { youtubeId: string; isActive: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  const post = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube.com"
    );
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.origin.includes("youtube.com")) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "onReady") {
          readyRef.current = true;
          if (isActive) post("playVideo"); else post("pauseVideo");
        }
        if (data.event === "onStateChange" && data.info === 0) {
          post("seekTo", [0, true]);
          post("playVideo");
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [post, isActive]);

  useEffect(() => {
    if (!readyRef.current) return;
    if (isActive) post("playVideo"); else post("pauseVideo");
  }, [isActive, post]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title="YouTube video"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="w-full h-full border-0 block"
    />
  );
}

function VimeoSlide({ vimeoId, isActive }: { vimeoId: string; isActive: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=0&controls=1&byline=0&title=0&portrait=0&dnt=1&transparent=0`;

  const post = useCallback((method: string, value?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method, value }),
      "https://player.vimeo.com"
    );
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.origin.includes("vimeo.com")) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "ready") {
          readyRef.current = true;
          post("addEventListener", "ended");
          post("setVolume", 0);
          if (isActive) post("play"); else post("pause");
        }
        if (data.event === "ended") {
          post("setCurrentTime", 0);
          post("play");
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [post, isActive]);

  useEffect(() => {
    if (!readyRef.current) return;
    if (isActive) post("play"); else { post("pause"); post("setCurrentTime", 0); }
  }, [isActive, post]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title="Vimeo video"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="w-full h-full border-0 block"
    />
  );
}

function LocalSlide({ src, isActive }: { src: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isActive) { 
      v.pause(); 
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        playsInline
        controls={isPlaying}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100 z-30 bg-black' : 'opacity-60'}`}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {isActive && !isPlaying && (
        <div 
          className="absolute inset-0 cursor-pointer flex items-center justify-center z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
          }}
        >
          <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors" />
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
            <Play className="w-4 h-4 text-white fill-white ml-0.5 drop-shadow-md" />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReelsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const animating = useRef(false);

  const [trackWidth, setTrackWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hovered, setHovered] = useState(false);
  const [clickable, setClickable] = useState(true);

  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? 5 : 3;
    }
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(3);
  const GAP = 12;

  // Measure track width
  useEffect(() => {
    if (!trackRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) {
        setTrackWidth(w);
        setVisibleCount(getVisibleCount());
      }
    });
    ro.observe(trackRef.current);
    
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const itemWidth = trackWidth > 0
    ? trackWidth < 640 
      ? trackWidth * 0.62 // Decreased to 62% to make the card shorter and fit better on mobile screens
      : (trackWidth - GAP * (visibleCount - 1)) / visibleCount // Desktop behavior - use available width
    : 200;

  const centerSlot = Math.floor(visibleCount / 2);

  const offsetToCenter = trackWidth > 0
    ? trackWidth / 2 - (centerSlot * (itemWidth + GAP) + itemWidth / 2)
    : 0;

  const SPRING = { type: "spring" as const, stiffness: 500, damping: 40 };

  const slide = useCallback((delta: number) => {
    if (animating.current || delta === 0) return;
    animating.current = true;
    animate(x, -(itemWidth + GAP) * delta, {
      ...SPRING,
      onComplete: () => {
        x.set(0);
        setActiveIndex((i) => {
          const next = i + delta;
          return ((next % REELS.length) + REELS.length) % REELS.length;
        });
        animating.current = false;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemWidth, x, SPRING]);

  const goNext = useCallback(() => slide(1), [slide]);
  const goPrev = useCallback(() => slide(-1), [slide]);

  const goTo = useCallback((index: number) => {
    const len = REELS.length;
    const raw = index - activeIndex;
    const delta = ((raw + Math.round(len / 2)) % len) - Math.round(len / 2);
    slide(delta);
  }, [activeIndex, slide]);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > itemWidth * 0.2) {
      setClickable(false);
      setTimeout(() => setClickable(true), 150);
    }
    if (info.offset.x < -itemWidth * 0.2) goNext();
    else if (info.offset.x > itemWidth * 0.2) goPrev();
  }, [itemWidth, goNext, goPrev]);

  // Build visible slides from center outward
  const visibleSlides = Array.from({ length: visibleCount }).map((_, slot) => {
    const offset = slot - centerSlot;
    const realIndex = ((activeIndex + offset) % REELS.length + REELS.length) % REELS.length;
    return { index: realIndex, reel: REELS[realIndex], isActive: slot === centerSlot };
  });

  // GSAP scroll animations — only this component's triggers
  useEffect(() => {
    if (!containerRef.current) return;
    const triggers: ScrollTrigger[] = [];

    const grid = containerRef.current.querySelector(".reels-grid");
    if (grid) {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.fromTo(grid,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
          );
        }
      });
      triggers.push(st);
    }

    const marker = containerRef.current.querySelector(".scene-marker");
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

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      id="reels"
      ref={containerRef}
      className="pt-6 pb-20 px-4 sm:px-6 md:px-12 border-t border-stroke mt-16 relative overflow-hidden"
    >
      <div className="absolute bottom-4 right-8 text-[8px] uppercase tracking-[0.2em] text-muted/15 font-mono select-none pointer-events-none">
        TAKE 01
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Screenplay Scene Marker */}
        <div className="scene-marker opacity-0 flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase font-mono mb-6 text-muted select-none">
          <span>SCENE 05</span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50" />
          <span>SHORT FORM</span>
        </div>

        <div className="flex justify-between items-baseline mb-8 pt-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            Short form
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-ghost">
              {activeIndex + 1} / {REELS.length}
            </span>
            {/* Arrow buttons — desktop only */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={goPrev}
                className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center text-muted hover:text-text hover:border-white/20 transition-colors"
                aria-label="Previous reel"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={goNext}
                className="w-8 h-8 rounded-full border border-stroke flex items-center justify-center text-muted hover:text-text hover:border-white/20 transition-colors"
                aria-label="Next reel"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel track */}
        <div
          className="reels-grid"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div ref={trackRef} className="relative w-full overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              style={{
                display: "flex",
                gap: GAP,
                alignItems: "flex-start",
                marginLeft: offsetToCenter,
                x,
                willChange: "transform",
              }}
            >
              {visibleSlides.map(({ index, reel, isActive }) => {
                const platform = detectPlatform(reel.video ?? "");
                const ytId = reel.video ? getYouTubeId(reel.video) : null;
                const vmId = reel.video ? getVimeoId(reel.video) : null;

                return (
                  <motion.div
                    key={`${index}-${reel.id}`}
                    aria-roledescription="slide"
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      width: itemWidth,
                      flexShrink: 0,
                      pointerEvents: clickable ? "auto" : "none",
                      willChange: "transform",
                    }}
                    animate={{
                      scale: isActive ? 1 : visibleCount === 1 ? 1 : 0.92,
                      opacity: isActive ? 1 : visibleCount === 1 ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="reel-card bg-surface border border-stroke rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    {/* 9:16 thumbnail */}
                    <div className="aspect-[9/16] bg-black relative overflow-hidden">

                      {reel.video && platform === "local" && (
                        <LocalSlide src={reel.video} isActive={isActive} />
                      )}
                      {reel.video && platform === "youtube" && ytId && (
                        <YouTubeSlide youtubeId={ytId} isActive={isActive} />
                      )}
                      {reel.video && platform === "vimeo" && vmId && (
                        <VimeoSlide vimeoId={vmId} isActive={isActive} />
                      )}

                      {/* Play overlay — only on non-active cards or local videos without autoplay */}
                      {!isActive && (
                        <div
                          className="absolute inset-0 flex items-center justify-center z-20 bg-black/30"
                          onClick={(e) => {
                            e.preventDefault();
                            const slot = visibleSlides.findIndex((s) => s.index === index);
                            const delta = slot - centerSlot;
                            if (delta !== 0) slide(delta);
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="px-3 pt-2 pb-3">
                      <h3 className="text-[13px] text-text/80 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {reel.name}
                      </h3>
                      <p className="text-[10px] text-faint mt-0.5">{reel.category}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dot navigation */}
          <div
            role="tablist"
            aria-label="Reel slides"
            className="flex items-center justify-center gap-2 mt-5"
          >
            {REELS.map((_, i) => {
              const isActiveDot = i === activeIndex;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={isActiveDot}
                  aria-label={`Go to reel ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: isActiveDot ? 24 : 6,
                    background: isActiveDot
                      ? "rgba(139, 92, 246, 0.8)"
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}