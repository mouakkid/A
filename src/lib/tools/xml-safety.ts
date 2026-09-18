/**
 * Garde-fous avant tout parsing XML côté navigateur :
 * - taille maximale ;
 * - refus des DOCTYPE et entités (XXE, « billion laughs ») ;
 * - refus des instructions de traitement externes.
 */
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 Mo
export const MAX_POINTS = 500_000;

export type SafetyResult = { ok: true } | { ok: false; error: string };

export function checkXmlSafety(text: string, byteLength: number): SafetyResult {
  if (byteLength > MAX_FILE_BYTES) return { ok: false, error: `Fichier trop volumineux (${(byteLength / 1048576).toFixed(1)} Mo, maximum 25 Mo).` };
  if (!text.trim()) return { ok: false, error: "Le fichier est vide." };
  const head = text.slice(0, 4096);
  if (/<!DOCTYPE/i.test(head) || /<!ENTITY/i.test(text)) return { ok: false, error: "Le fichier contient une déclaration DOCTYPE ou ENTITY : refusé par sécurité (risque XXE)." };
  if (/<\?xml-stylesheet/i.test(head)) return { ok: false, error: "Instruction xml-stylesheet refusée." };
  if (!/<\s*(gpx|TrainingCenterDatabase)\b/i.test(head)) return { ok: false, error: "Ce fichier ne semble être ni un GPX ni un TCX (élément racine introuvable)." };
  return { ok: true };
}
