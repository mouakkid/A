import type { Metadata } from "next";
import { getTool } from "@/lib/tools/catalog";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { ConverterTool } from "@/components/tools/converter-tool";

const tool = getTool("convertisseur-gpx-tcx")!;
export const metadata: Metadata = { title: tool.title, description: tool.description, alternates: { canonical: "/outils/convertisseur-gpx-tcx" } };

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <ConverterTool />
    </ToolPageShell>
  );
}
