import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ToolMeta } from "@/lib/tools/catalog";
import { PageHeader } from "@/components/ui/page-header";

export function ToolPageShell({ tool, children }: { tool: ToolMeta; children: ReactNode }) {
  return (
    <>
      <PageHeader crumbs={[{ label: "Outils", href: "/outils" }, { label: tool.title }]} eyebrow="Outils Garmin.ma" title={tool.title} intro={tool.description} />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">{children}</div>
        <aside className="space-y-5 text-sm">
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Formats acceptés</h2>
            <p className="mt-2 text-fg-muted">{tool.formats}</p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Exemple d'usage</h2>
            <p className="mt-2 text-fg-muted">{tool.example}</p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold">Limites</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-fg-muted">
              {tool.limits.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-graphite-900 p-5 text-white bg-topo">
            <h2 className="inline-flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-accent" aria-hidden />Vos données</h2>
            <p className="mt-2 text-white/75">{tool.dataHandling}</p>
            <Link href="/confidentialite" className="mt-3 inline-block underline">Politique de confidentialité</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
