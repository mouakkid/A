/**
 * Préparation multilingue.
 * - Le français est la seule langue publiée.
 * - L'arabe (RTL) est déclaré mais désactivé : aucune route /ar n'est servie tant que
 *   le dictionnaire n'est pas complet (voir docs/I18N.md). Aucune page vide ni traduction partielle.
 */
export const locales = [
  { code: "fr", label: "Français", dir: "ltr", enabled: true },
  { code: "ar", label: "العربية", dir: "rtl", enabled: false },
] as const;

export type LocaleCode = (typeof locales)[number]["code"];
export const defaultLocale: LocaleCode = "fr";

export function getLocale(code: string) {
  return locales.find((l) => l.code === code && l.enabled) ?? locales[0];
}
