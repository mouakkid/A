import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

export type TocItem = { id: string; text: string; level: 2 | 3 };

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    a: [...(defaultSchema.attributes?.a ?? []), "rel", "target"],
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
  },
};

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(rehypeSanitize, schema).use(rehypeStringify);

/** Rend du Markdown en HTML assaini et extrait un sommaire (h2/h3). */
export async function renderMarkdown(md: string): Promise<{ html: string; toc: TocItem[] }> {
  const file = await processor.process(md);
  const html = String(file);
  const toc: TocItem[] = [];
  const re = /<h([23]) id="([^"]+)">(.*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    toc.push({ level: Number(m[1]) as 2 | 3, id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return { html, toc };
}

export function readingTimeMinutes(md: string): number {
  const words = md.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
