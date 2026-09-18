import type { Metadata } from "next";
import { getTool } from "@/lib/tools/catalog";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { InspectorTool } from "@/components/tools/inspector-tool";

const tool = getTool("inspecteur-gpx-tcx")!;
export const metadata: Metadata = { title: tool.title, description: tool.description, alternates: { canonical: "/outils/inspecteur-gpx-tcx" } };

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <InspectorTool />
    </ToolPageShell>
  );
}
