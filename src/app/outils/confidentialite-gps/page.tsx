import type { Metadata } from "next";
import { getTool } from "@/lib/tools/catalog";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import { PrivacyTool } from "@/components/tools/privacy-tool";

const tool = getTool("confidentialite-gps")!;
export const metadata: Metadata = { title: tool.title, description: tool.description, alternates: { canonical: "/outils/confidentialite-gps" } };

export default function Page() {
  return (
    <ToolPageShell tool={tool}>
      <PrivacyTool />
    </ToolPageShell>
  );
}
