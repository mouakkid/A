import type { Metadata } from "next";
import { Suspense } from "react";
import { getTool } from "@/lib/tools/catalog";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { RaceStrategyTool } from "@/components/tools/race-strategy-tool";

const tool = getTool("strategie-de-course")!;
export const metadata: Metadata = { title: tool.title, description: tool.description, alternates: { canonical: "/outils/strategie-de-course" } };

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <Suspense fallback={<p className="text-fg-muted">Chargement de l'outil…</p>}>
        <RaceStrategyTool />
      </Suspense>
    </ToolPageShell>
  );
}
