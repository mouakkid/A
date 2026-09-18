import "server-only";
import { cache } from "react";
import { and, eq, inArray, asc, ilike, or, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db/client";
import { devices, deviceSources } from "@/lib/db/schema";
import { deviceSpecSchema, deviceEditorialSchema, type Device, type DeviceCategory } from "./types";

type Row = typeof devices.$inferSelect;

function toDevice(row: Row, sources: { label: string; url: string; accessedAt: Date | null }[] = []): Device {
  return {
    id: row.id,
    slug: row.slug,
    model: row.model,
    variant: row.variant,
    family: row.family,
    category: row.category as DeviceCategory,
    status: row.status,
    officialUrl: row.officialUrl,
    lastVerifiedAt: row.lastVerifiedAt,
    spec: deviceSpecSchema.parse(row.spec),
    editorial: deviceEditorialSchema.parse(row.editorial),
    sources,
  };
}

async function attachSources(rows: Row[]): Promise<Device[]> {
  if (rows.length === 0) return [];
  const src = await db.select().from(deviceSources).where(inArray(deviceSources.deviceId, rows.map((r) => r.id)));
  const bySlug = new Map<number, { label: string; url: string; accessedAt: Date | null }[]>();
  for (const s of src) {
    const arr = bySlug.get(s.deviceId) ?? [];
    arr.push({ label: s.label, url: s.url, accessedAt: s.accessedAt });
    bySlug.set(s.deviceId, arr);
  }
  return rows.map((r) => toDevice(r, bySlug.get(r.id) ?? []));
}

export const listPublishedDevices = cache(async (category?: DeviceCategory): Promise<Device[]> => {
  if (!isDatabaseConfigured()) return [];
  const where = category ? and(eq(devices.status, "published"), eq(devices.category, category)) : eq(devices.status, "published");
  const rows = await db.select().from(devices).where(where).orderBy(asc(devices.family), asc(devices.model), asc(devices.variant));
  return attachSources(rows);
});

export const getDeviceBySlug = cache(async (slug: string, includeUnpublished = false): Promise<Device | null> => {
  if (!isDatabaseConfigured()) return null;
  const where = includeUnpublished ? eq(devices.slug, slug) : and(eq(devices.slug, slug), eq(devices.status, "published"));
  const rows = await db.select().from(devices).where(where).limit(1);
  if (!rows[0]) return null;
  const [d] = await attachSources(rows);
  return d;
});

export const getDevicesBySlugs = cache(async (slugs: string[]): Promise<Device[]> => {
  if (!isDatabaseConfigured() || slugs.length === 0) return [];
  const rows = await db.select().from(devices).where(and(inArray(devices.slug, slugs), eq(devices.status, "published")));
  const list = await attachSources(rows);
  // conserver l'ordre demandé
  return slugs.map((s) => list.find((d) => d.slug === s)).filter((d): d is Device => Boolean(d));
});

export async function searchDevices(q: string, limit = 12): Promise<Device[]> {
  if (!isDatabaseConfigured() || !q.trim()) return [];
  const pattern = `%${q.trim().replace(/[%_]/g, "")}%`;
  const rows = await db
    .select()
    .from(devices)
    .where(and(eq(devices.status, "published"), or(ilike(devices.model, pattern), ilike(devices.family, pattern), ilike(devices.slug, pattern))))
    .orderBy(asc(devices.model))
    .limit(limit);
  return attachSources(rows);
}

export async function countDevicesByCategory(): Promise<Record<string, number>> {
  if (!isDatabaseConfigured()) return {};
  const rows = await db
    .select({ category: devices.category, count: sql<number>`count(*)::int` })
    .from(devices)
    .where(eq(devices.status, "published"))
    .groupBy(devices.category);
  return Object.fromEntries(rows.map((r) => [r.category, r.count]));
}
