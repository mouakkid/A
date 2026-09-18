import { site } from "@/config/site";

const dateFmt = new Intl.DateTimeFormat("fr-MA", { dateStyle: "long", timeZone: site.timeZone });
const dateTimeFmt = new Intl.DateTimeFormat("fr-MA", { dateStyle: "medium", timeStyle: "short", timeZone: site.timeZone });
const numberFmt = new Intl.NumberFormat("fr-MA");

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateFmt.format(typeof d === "string" ? new Date(d) : d);
}
export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return dateTimeFmt.format(typeof d === "string" ? new Date(d) : d);
}
export function formatNumber(n: number, digits = 0): string {
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}
export function formatInt(n: number): string {
  return numberFmt.format(Math.round(n));
}
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}
export function isoDate(d: Date | string | null | undefined): string | undefined {
  if (!d) return undefined;
  return (typeof d === "string" ? new Date(d) : d).toISOString();
}
