import Link from "next/link";
import { site } from "@/config/site";
import { footerNav } from "@/config/navigation";
import { BrandBlock } from "@/components/brand/brand-block";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-graphite-900 text-white bg-topo">
      <div className="container-x py-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <BrandBlock variant="dark" />
            <p className="mt-4 text-sm text-white/70">{site.tagline}. Guides, comparateur, assistant de choix, outils GPX/TCX et forum d'entraide.</p>
            <p className="mt-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/85">{site.independence.short}</p>
          </div>
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-white/60">{site.independence.long}</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} {site.name} · Langue : français · Une version arabe (RTL) est prévue, sans traduction partielle publiée.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
