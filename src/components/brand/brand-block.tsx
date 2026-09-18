import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Bloc de marque « GARMIN · COMMUNAUTÉ MAROC ».
 *
 * Composition typographique provisoire : aucun fichier de logo Garmin dont les
 * conditions d'utilisation ont été vérifiées n'est disponible. Ce n'est PAS un logo
 * officiel. Pour le remplacer : fournir un SVG dans /public/brand/garmin-logo.svg,
 * puis remplacer <WordmarkGarmin /> par l'image (voir docs/BRAND.md).
 * La mention « COMMUNAUTÉ MAROC » doit rester visible à toutes les tailles.
 */
export function BrandBlock({
  variant = "auto",
  size = "md",
  withLink = true,
  className,
}: {
  variant?: "auto" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
  className?: string;
}) {
  const tone =
    variant === "light" ? "text-fg" : variant === "dark" ? "text-white" : "text-fg dark:text-white";
  const sizes = {
    sm: { word: "text-[1.05rem] tracking-[0.18em]", sub: "text-[0.5rem] tracking-[0.22em]", gap: "gap-0.5" },
    md: { word: "text-[1.35rem] tracking-[0.2em]", sub: "text-[0.6rem] tracking-[0.26em]", gap: "gap-0.5" },
    lg: { word: "text-[2.4rem] tracking-[0.2em]", sub: "text-[0.95rem] tracking-[0.3em]", gap: "gap-1.5" },
  }[size];

  const content = (
    <span className={cn("inline-flex flex-col leading-none select-none", sizes.gap, tone, className)}>
      <span className={cn("font-display font-black uppercase", sizes.word)} style={{ fontStretch: "110%" }}>
        Garmin
      </span>
      <span className={cn("font-display font-semibold uppercase", variant === "dark" ? "text-accent-bright" : "text-accent-strong dark:text-accent-bright", sizes.sub)}>Communauté Maroc</span>
    </span>
  );

  if (!withLink) return content;
  return (
    <Link href="/" className="inline-flex items-center rounded-md">
      {content}
      <span className="sr-only">, retour à l'accueil</span>
    </Link>
  );
}

/** Symbole communautaire distinct (favicon / marque secondaire) : trois courbes topographiques et un point GPS. */
export function CommunityMark({ className, title = "Symbole Garmin.ma" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="currentColor" className="text-graphite-900" />
      <g fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d="M10 44c8-10 16-10 22-4s14 6 22-4" />
        <path d="M10 34c8-10 16-10 22-4s14 6 22-4" opacity="0.6" />
        <path d="M10 24c8-10 16-10 22-4s14 6 22-4" opacity="0.35" />
      </g>
      <circle cx="44" cy="20" r="6" fill="#1d6ef5" />
      <circle cx="44" cy="20" r="2.4" fill="#ffffff" />
    </svg>
  );
}
