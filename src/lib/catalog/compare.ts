import type { Device, DeviceSpec } from "./types";
import { specGroups, getPath, type SpecRow } from "./labels";

export type CellValue = { kind: "bool"; value: boolean } | { kind: "text"; value: string } | { kind: "list"; value: string[] } | { kind: "battery"; value: { mode: string; claim: string }[] } | { kind: "price"; value: NonNullable<DeviceSpec["price"]> } | { kind: "unknown" };

export type CompareRow = { key: string; label: string; hint?: string; cells: CellValue[]; differs: boolean };
export type CompareGroup = { key: string; title: string; rows: CompareRow[] };

function toCell(v: unknown, key: string): CellValue {
  if (v === null || v === undefined) return { kind: "unknown" };
  if (key === "battery") return Array.isArray(v) && v.length ? { kind: "battery", value: v as { mode: string; claim: string }[] } : { kind: "unknown" };
  if (key === "price") return { kind: "price", value: v as NonNullable<DeviceSpec["price"]> };
  if (typeof v === "boolean") return { kind: "bool", value: v };
  if (Array.isArray(v)) return v.length ? { kind: "list", value: v.map(String) } : { kind: "unknown" };
  if (typeof v === "number") return { kind: "text", value: String(v).replace(".", ",") };
  return { kind: "text", value: String(v) };
}

function cellKey(c: CellValue): string {
  switch (c.kind) {
    case "unknown": return "?";
    case "bool": return c.value ? "1" : "0";
    case "text": return c.value.trim().toLowerCase();
    case "list": return [...c.value].map((s) => s.toLowerCase()).sort().join("|");
    case "battery": return c.value.map((b) => `${b.mode}=${b.claim}`.toLowerCase()).join("|");
    case "price": return `${c.value.amount}${c.value.currency}${c.value.market}`;
  }
}

/** Construit les lignes de comparaison ; `differs` est vrai si au moins deux valeurs connues diffèrent. */
export function buildComparison(devicesList: Device[]): CompareGroup[] {
  return specGroups.map((g) => ({
    key: g.key,
    title: g.title,
    rows: g.rows.map((row: SpecRow) => {
      const cells = devicesList.map((d) => toCell(getPath(d.spec, row.key), row.key));
      const known = cells.filter((c) => c.kind !== "unknown").map(cellKey);
      const differs = new Set(known).size > 1;
      return { key: row.key, label: row.label, hint: row.hint, cells, differs };
    }),
  }));
}

/** Résumé des différences décisives, en langage simple, sans désigner de gagnant. */
export function decisiveDifferences(devicesList: Device[]): string[] {
  const out: string[] = [];
  const name = (d: Device) => (d.variant ? `${d.model} (${d.variant})` : d.model);
  const known = <T,>(sel: (d: Device) => T | null | undefined) => devicesList.map((d) => ({ d, v: sel(d) })).filter((x): x is { d: Device; v: T } => x.v !== null && x.v !== undefined);

  const weights = known((d) => d.spec.weightG);
  if (weights.length >= 2) {
    const sorted = [...weights].sort((a, b) => a.v - b.v);
    if (sorted[sorted.length - 1].v - sorted[0].v >= 8) out.push(`${name(sorted[0].d)} est le plus léger (${sorted[0].v} g) ; ${name(sorted[sorted.length - 1].d)} pèse ${sorted[sorted.length - 1].v} g.`);
  }
  const display = known((d) => d.spec.display.type);
  if (new Set(display.map((x) => x.v.toLowerCase())).size > 1) {
    out.push(`Types d'écran différents : ${display.map((x) => `${name(x.d)} → ${x.v}`).join(" ; ")}. Un écran AMOLED est plus lisible en intérieur, un écran MIP privilégie l'autonomie et la lisibilité en plein soleil.`);
  }
  const maps = known((d) => d.spec.maps.preloadedMaps);
  if (maps.some((x) => x.v) && maps.some((x) => !x.v)) {
    out.push(`Cartographie intégrée vérifiée : ${maps.filter((x) => x.v).map((x) => name(x.d)).join(", ")}. Sans cartes préchargées : ${maps.filter((x) => !x.v).map((x) => name(x.d)).join(", ")}.`);
  }
  const mb = known((d) => d.spec.gnss.multiband);
  if (mb.some((x) => x.v) && mb.some((x) => !x.v)) {
    out.push(`GPS multi-bande : ${mb.filter((x) => x.v).map((x) => name(x.d)).join(", ")} — plus adapté aux gorges, forêts denses et villes ; ${mb.filter((x) => !x.v).map((x) => name(x.d)).join(", ")} sans multi-bande.`);
  }
  const music = known((d) => d.spec.features.musicStorage);
  if (music.some((x) => x.v) && music.some((x) => !x.v)) out.push(`Musique embarquée : ${music.filter((x) => x.v).map((x) => name(x.d)).join(", ")} uniquement.`);
  const solar = known((d) => d.spec.features.solar);
  if (solar.some((x) => x.v) && solar.some((x) => !x.v)) out.push(`Recharge solaire : ${solar.filter((x) => x.v).map((x) => name(x.d)).join(", ")} — plus adapté aux longues sorties sans recharge.`);
  const flash = known((d) => d.spec.features.flashlight);
  if (flash.some((x) => x.v) && flash.some((x) => !x.v)) out.push(`Lampe torche LED : ${flash.filter((x) => x.v).map((x) => name(x.d)).join(", ")}.`);
  const sizes = known((d) => d.spec.dimensionsMm);
  if (sizes.length >= 2) {
    const parsed = sizes.map((x) => ({ d: x.d, w: Number(x.v.split(/x|×/)[0]?.replace(",", ".")) })).filter((x) => Number.isFinite(x.w));
    if (parsed.length >= 2) {
      const s = [...parsed].sort((a, b) => a.w - b.w);
      if (s[s.length - 1].w - s[0].w >= 3) out.push(`${name(s[0].d)} est le plus compact (${s[0].w} mm de large).`);
    }
  }
  const prices = known((d) => d.spec.price);
  if (prices.length >= 2 && new Set(prices.map((p) => p.v.currency)).size === 1) {
    const s = [...prices].sort((a, b) => a.v.amount - b.v.amount);
    out.push(`Écart de prix constructeur (${s[0].v.market}) : de ${s[0].v.amount} à ${s[s.length - 1].v.amount} ${s[0].v.currency}. Ces prix ne sont pas des prix constatés au Maroc.`);
  }
  const unknownCount = devicesList.map((d) => ({ d, n: countUnknown(d.spec) })).filter((x) => x.n > 6);
  if (unknownCount.length) out.push(`Données incomplètes pour ${unknownCount.map((x) => name(x.d)).join(", ")} : plusieurs caractéristiques sont « Non vérifié ». Absence d'information ≠ absence de fonctionnalité.`);
  return out;
}

export function countUnknown(spec: DeviceSpec): number {
  let n = 0;
  for (const g of specGroups) for (const r of g.rows) {
    const v = getPath(spec, r.key);
    if (v === null || v === undefined || (Array.isArray(v) && v.length === 0)) n++;
  }
  return n;
}
