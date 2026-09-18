import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils/cn";

export function PageHeader({ crumbs, eyebrow, title, intro, children, tone = "default", className }: { crumbs: Crumb[]; eyebrow?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; tone?: "default" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={cn(dark ? "bg-graphite-900 text-white bg-topo" : "border-b border-border bg-bg-muted bg-topo-dark", className)}>
      <div className="container-x py-10 sm:py-14">
        <Breadcrumbs items={crumbs} className={dark ? "[&_a]:text-white/60 [&_span]:text-white/90 [&_li]:text-white/50" : undefined} />
        <div className="mt-6 max-w-3xl">
          {eyebrow && <p className={cn("mb-2 text-xs font-semibold uppercase tracking-[0.22em]", dark ? "text-accent-bright" : "text-accent-strong dark:text-accent-bright")}>{eyebrow}</p>}
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
          {intro && <p className={cn("mt-4 text-base sm:text-lg", dark ? "text-white/75" : "text-fg-muted")}>{intro}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
