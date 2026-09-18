import type { Metadata } from "next";
import { Suspense } from "react";
import { getTool } from "@/lib/tools/catalog";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { PaceTool } from "@/components/tools/pace-tool";

const tool = getTool("allure-vitesse-temps")!;
export const metadata: Metadata = { title: tool.title, description: tool.description, alternates: { canonical: "/outils/allure-vitesse-temps" } };

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <Suspense fallback={<p className="text-fg-muted">Chargement de l'outil…</p>}>
        <PaceTool />
      </Suspense>
    </ToolPageShell>
  );
}
