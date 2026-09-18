"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Ajoute .is-visible aux éléments .reveal quand ils entrent dans le viewport. Sans JS, le CSS reduced-motion les affiche. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    nodes.forEach((n) => io.observe(n));
    // Sécurité : tout ce qui n'a pas été vu après 2,5 s devient visible (éviter un contenu masqué).
    const t = window.setTimeout(() => nodes.forEach((n) => n.classList.add("is-visible")), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);
  return null;
}
