import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
  className,
  tone = "default",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  action?: { label: string; href: string };
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted" | "dark";
}) {
  const toneCls = tone === "muted" ? "bg-bg-muted" : tone === "dark" ? "bg-graphite-900 text-white" : "";
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", toneCls, className)}>
      <div className="container-x">
        {(title || eyebrow) && (
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl reveal">
              {eyebrow && <p className={cn("mb-2 text-xs font-semibold uppercase tracking-[0.22em]", tone === "dark" ? "text-accent-bright" : "text-accent-strong dark:text-accent-bright")}>{eyebrow}</p>}
              {title && <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>}
              {intro && <p className={cn("mt-3 text-base sm:text-lg", tone === "dark" ? "text-white/70" : "text-fg-muted")}>{intro}</p>}
            </div>
            {action && (
              <Link href={action.href} className={cn("group inline-flex items-center gap-1.5 text-sm font-semibold reveal reveal-delay-1", tone === "dark" ? "text-white" : "text-fg")}>
                {action.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
