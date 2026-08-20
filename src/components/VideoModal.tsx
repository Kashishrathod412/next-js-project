"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string; // Could be HLS stream URL or generic mp4
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll lock and Pause on close
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // HLS and source logic
  useEffect(() => {
    if (!isOpen || !videoUrl || !videoRef.current) return;

    const isHLS = videoUrl.includes(".m3u8");
    
    if (isHLS) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({ startLevel: -1 });
          hls.loadSource(videoUrl);
          hls.attachMedia(videoRef.current!);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play().catch(() => {});
          });
          return () => hls.destroy();
        } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
          videoRef.current.src = videoUrl;
          videoRef.current.play().catch(() => {});
        }
      });
    } else {
      videoRef.current.src = videoUrl;
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, videoUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-[201]"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-5xl aspect-video bg-surface rounded-lg overflow-hidden border border-stroke shadow-2xl relative">
            {videoUrl ? (
              <video
                ref={videoRef}
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                <span className="text-sm uppercase tracking-widest text-faint mb-2">Video Placeholder</span>
                <span className="text-xs">Provide a valid [REEL_URL] to stream here.</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

