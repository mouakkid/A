import { LIMITS } from "./constants";

/** Heuristiques antispam simples et explicables. Retourne une raison de refus ou null. */
export function spamCheck(text: string, opts: { accountAgeDays: number }): string | null {
  const links = (text.match(/https?:\/\/|www\./gi) ?? []).length;
  if (opts.accountAgeDays < 2 && links > LIMITS.maxLinksNewMember) return "Les nouveaux comptes ne peuvent pas publier plus de deux liens par message.";
  if (links > 12) return "Trop de liens dans le message.";
  const upper = text.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (upper.length > 40 && upper.replace(/[^A-ZÀ-Ý]/g, "").length / upper.length > 0.7) return "Merci d'éviter les messages entièrement en majuscules.";
  if (/(.)\1{14,}/.test(text)) return "Le message contient des répétitions anormales.";
  const coordinates = text.match(/-?\d{1,2}\.\d{4,},\s*-?\d{1,3}\.\d{4,}/g);
  if (coordinates && coordinates.length > 0) return "Le message semble contenir des coordonnées GPS précises : par respect de la vie privée, retirez-les ou arrondissez-les.";
  return null;
}

/** Honeypot : un champ caché rempli signale un robot. */
export function honeypotTriggered(value: FormDataEntryValue | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
