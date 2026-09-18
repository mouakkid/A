"use client";
import { useEffect, useRef } from "react";

/**
 * Visuel de hero généré (SVG) : massif de l'Atlas stylisé, trace GPS, cadran.
 * Parallaxe modérée au défilement, désactivée avec prefers-reduced-motion.
 * Remplaçable par une photographie dont l'usage est autorisé (voir docs/BRAND.md).
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 600);
        el.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  const show = process.env.NEXT_PUBLIC_SITE_ENV !== "production";
  return (
    <div ref={ref} className="parallax relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden>
      <svg viewBox="0 0 640 520" className="w-full drop-shadow-2xl" role="img" aria-label="Illustration : montagnes de l'Atlas et trace GPS">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f252c" /><stop offset="1" stopColor="#0b0d10" /></linearGradient>
          <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b4654" /><stop offset="1" stopColor="#14181d" /></linearGradient>
          <radialGradient id="glow" cx="0.7" cy="0.25" r="0.5"><stop offset="0" stopColor="#5a9bff" stopOpacity="0.35" /><stop offset="1" stopColor="#5a9bff" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="640" height="520" rx="28" fill="url(#sky)" />
        <rect width="640" height="520" rx="28" fill="url(#glow)" />
        <g fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1.2">
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M-10 ${140 + i * 42} C 120 ${110 + i * 42}, 200 ${180 + i * 42}, 330 ${140 + i * 42} S 540 ${170 + i * 42}, 660 ${130 + i * 42}`} />
          ))}
        </g>
        <path d="M0 380 L90 290 L150 330 L230 210 L300 280 L360 230 L440 320 L520 250 L600 330 L640 300 L640 520 L0 520 Z" fill="url(#ridge)" opacity="0.85" />
        <path d="M0 430 L70 380 L160 410 L250 340 L330 400 L420 350 L520 420 L640 370 L640 520 L0 520 Z" fill="#14181d" />
        <path d="M60 470 C 150 430, 200 470, 280 420 S 420 440, 480 380 S 560 350, 600 320" fill="none" stroke="#5a9bff" strokeWidth="3" strokeDasharray="7 9" strokeLinecap="round" />
        <circle cx="600" cy="320" r="9" fill="#1d6ef5" />
        <circle cx="600" cy="320" r="4" fill="#fff" />
        <circle cx="600" cy="320" r="18" fill="none" stroke="#5a9bff" strokeOpacity="0.5">
          <animate attributeName="r" values="12;26;12" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        <g transform="translate(88 96)">
          <circle r="62" fill="#0b0d10" stroke="#2b333c" strokeWidth="4" />
          <circle r="54" fill="none" stroke="#1d6ef5" strokeWidth="6" strokeDasharray="230 340" strokeLinecap="round" transform="rotate(-90)" />
          <text x="0" y="-6" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700" fontFamily="sans-serif">5:12</text>
          <text x="0" y="14" textAnchor="middle" fill="#8b93a0" fontSize="10" fontFamily="sans-serif">min/km</text>
        </g>
      </svg>
      {show && <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90">Visuel provisoire</span>}
    </div>
  );
}
