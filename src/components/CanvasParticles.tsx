"use client";

import { useEffect, useRef } from "react";

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 640;
    const PARTICLE_COUNT = isMobile ? 20 : 80;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 0.2 + Math.random() * 1.5,
      a: 0.02 + Math.random() * 0.15,
      isDust: Math.random() > 0.8
    }));

    const mouse = { x: w / 2, y: h / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    const resizeObserver = new ResizeObserver(() => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
    resizeObserver.observe(document.body);

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx + (mouse.x - w/2) * 0.00005;
        p.y += p.vy + (mouse.y - h/2) * 0.00005;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isDust ? `rgba(139, 92, 246, ${p.a})` : `rgba(255, 255, 255, ${p.a})`;
        ctx.fill();
      });

      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 250
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.04)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" style={{ transform: "translateZ(0)" }} />;
}
