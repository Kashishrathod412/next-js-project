"use client";

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);
  
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
  
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update);
  
    // Robust height recalculation for tablet/mobile views where dvh or late-mounting elements break scroll height
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      lenisRef.current?.lenis?.resize();
    });
    
    if (typeof document !== 'undefined') {
      ro.observe(document.body);
    }

    return () => {
      gsap.ticker.remove(update);
      ro.disconnect();
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.12, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
