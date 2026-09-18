import type { Metadata } from "next";
import { Suspense } from "react";
import { getTool } from "@/lib/tools/catalog";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { HrZonesTool } from "@/components/tools/hr-zones-tool";

const tool = getTool("zones-frequence-cardiaque")!;
export const metadata: Metadata = { title: tool.title, description: tool.description, alternates: { canonical: "/outils/zones-frequence-cardiaque" } };

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <Suspense fallback={<p className="text-fg-muted">Chargement de l'outil…</p>}>
        <HrZonesTool />
      </Suspense>
    </ToolPageShell>
  );
}
