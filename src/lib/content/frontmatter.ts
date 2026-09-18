/** Analyse minimale de front-matter YAML (clé: valeur, listes [a, b] ou - a, blocs multi-lignes simples). */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, unknown> = {};
  const lines = m[1].split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) { i++; continue; }
    const key = kv[1];
    const val = kv[2].trim();
    if (val === "" && lines[i + 1]?.match(/^\s+-\s+/)) {
      const arr: unknown[] = [];
      i++;
      while (i < lines.length && lines[i].match(/^\s+-\s+/)) {
        const item = lines[i].replace(/^\s+-\s+/, "").trim();
        arr.push(parseItem(item));
        i++;
      }
      data[key] = arr;
      continue;
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      data[key] = val.slice(1, -1).split(",").map((s) => parseScalar(s.trim())).filter((s) => s !== "");
    } else {
      data[key] = parseScalar(val);
    }
    i++;
  }
  return { data, body: m[2] };
}

function parseItem(item: string): unknown {
  // objet inline { label: ..., url: ... }
  const obj = item.match(/^\{(.*)\}$/);
  if (obj) {
    const out: Record<string, unknown> = {};
    for (const part of obj[1].split(/,(?=\s*[a-zA-Z_]+\s*:)/)) {
      const kv = part.match(/^\s*([a-zA-Z_]+)\s*:\s*(.*)$/);
      if (kv) out[kv[1]] = parseScalar(kv[2].trim());
    }
    return out;
  }
  return parseScalar(item);
}

function parseScalar(v: string): unknown {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}
