import Link from "next/link";
import { Scale, Wrench, UserRound } from "lucide-react";
import { site } from "@/config/site";
import { primaryNav } from "@/config/navigation";
import { BrandBlock } from "@/components/brand/brand-block";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchTrigger } from "@/components/layout/search-dialog";

export function SiteHeader({ user }: { user: { username: string; role: string } | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/75" style={{ height: "var(--header-h)" }}>
      <div className="container-x flex h-full items-center gap-4">
        <div className="flex items-center gap-3">
          <MobileNav items={primaryNav} user={user} />
          <BrandBlock size="sm" />
          <span className="hidden rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-fg-muted xl:inline-flex" title={site.independence.long}>
            {site.independence.short}
          </span>
        </div>

        <nav aria-label="Navigation principale" className="hidden flex-1 items-center justify-center lg:flex">
          <MegaMenu items={primaryNav} />
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchTrigger />
          <Link href="/comparer" className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg md:inline-flex">
            <Scale className="size-4" aria-hidden />
            Comparer
          </Link>
          <Link href="/outils" className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-fg-muted hover:bg-bg-muted hover:text-fg md:inline-flex">
            <Wrench className="size-4" aria-hidden />
            Outils
          </Link>
          {user ? (
            <Link href="/compte" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium hover:bg-bg-muted">
              <UserRound className="size-4" aria-hidden />
              <span className="hidden sm:inline">{user.username}</span>
              <span className="sr-only sm:hidden">Mon compte</span>
            </Link>
          ) : (
            <Link href="/connexion" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-fg px-4 text-sm font-semibold text-bg hover:opacity-90">
              <UserRound className="size-4 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">Connexion</span>
              <span className="sr-only sm:hidden">Connexion</span>
            </Link>
          )}
        </div>
      </div>
      <p className="sr-only">{site.independence.short}</p>
    </header>
  );
}
