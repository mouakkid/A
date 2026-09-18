import { cn } from "@/lib/utils/cn";

/**
 * Visuel généré (SVG) utilisé à la place d'une photographie tant qu'aucune image
 * dont l'usage est autorisé n'est disponible. Le libellé « Visuel provisoire »
 * reste visible hors production pour ne pas être oublié.
 */
export function PlaceholderVisual({
  theme = "atlas",
  className,
  label = "Visuel provisoire",
}: {
  theme?: "atlas" | "littoral" | "route" | "piste" | "graphite";
  className?: string;
  label?: string;
}) {
  const palettes = {
    atlas: ["#0b0d10", "#1f252c", "#3b4654", "#1d6ef5"],
    littoral: ["#071a2b", "#0d3552", "#1d6ef5", "#8fd0ff"],
    route: ["#101214", "#22262b", "#40464e", "#e3e6ea"],
    piste: ["#1a1410", "#3a2b1e", "#7a5a3a", "#f0c27a"],
    graphite: ["#0b0d10", "#14181d", "#1f252c", "#2b333c"],
  }[theme];
  const showLabel = process.env.NEXT_PUBLIC_SITE_ENV !== "production";
  return (
    <div className={cn("relative overflow-hidden", className)} aria-hidden>
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`g-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palettes[1]} />
            <stop offset="1" stopColor={palettes[0]} />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill={`url(#g-${theme})`} />
        <path d="M0 360 L120 250 L210 310 L320 180 L430 290 L520 210 L640 320 L740 240 L800 300 L800 500 L0 500 Z" fill={palettes[2]} opacity="0.55" />
        <path d="M0 420 L90 340 L200 390 L310 300 L420 380 L560 310 L680 400 L800 350 L800 500 L0 500 Z" fill={palettes[1]} opacity="0.9" />
        <g fill="none" stroke={palettes[3]} strokeWidth="2" opacity="0.8">
          <path d="M40 470 C160 430, 220 470, 330 420 S 520 440, 620 380 S 740 360, 790 330" strokeDasharray="6 8" />
        </g>
        <circle cx="790" cy="330" r="7" fill={palettes[3]} />
      </svg>
      {showLabel && (
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90">
          {label}
        </span>
      )}
    </div>
  );
}
