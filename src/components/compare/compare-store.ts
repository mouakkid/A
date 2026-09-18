"use client";
import { useSyncExternalStore } from "react";

export const COMPARE_MAX = 4;
const KEY = "gma-compare";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string").slice(0, COMPARE_MAX) : [];
  } catch {
    cache = [];
  }
  return cache;
}
function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}
const EMPTY: string[] = [];

export function useCompareList(): string[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) {
          cache = null;
          cb();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    read,
    () => EMPTY,
  );
}

export const compareStore = {
  toggle(slug: string): { ok: boolean; reason?: string } {
    const cur = read();
    if (cur.includes(slug)) {
      write(cur.filter((s) => s !== slug));
      return { ok: true };
    }
    if (cur.length >= COMPARE_MAX) return { ok: false, reason: `Maximum ${COMPARE_MAX} modèles à la fois.` };
    write([...cur, slug]);
    return { ok: true };
  },
  remove(slug: string) {
    write(read().filter((s) => s !== slug));
  },
  clear() {
    write([]);
  },
  has(slug: string) {
    return read().includes(slug);
  },
};
