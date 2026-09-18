"use client";
import { useCallback, useEffect, useRef } from "react";
import type { WorkerRequest, WorkerResponse } from "@/lib/tools/worker";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** Envoie un traitement au Web Worker et retourne une promesse typée. */
export function useActivityWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, { resolve: (r: WorkerResponse) => void }>());
  const seq = useRef(0);

  useEffect(() => {
    const w = new Worker(new URL("../../lib/tools/worker.ts", import.meta.url), { type: "module" });
    w.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const p = pending.current.get(e.data.id);
      if (p) {
        pending.current.delete(e.data.id);
        p.resolve(e.data);
      }
    };
    w.onerror = () => {
      for (const [id, p] of pending.current) {
        p.resolve({ id, ok: false, error: "Le traitement a échoué dans le navigateur (fichier trop complexe ?)." });
      }
      pending.current.clear();
    };
    workerRef.current = w;
    return () => w.terminate();
  }, []);

  return useCallback((req: DistributiveOmit<WorkerRequest, "id">): Promise<WorkerResponse> => {
    return new Promise((resolve) => {
      const id = ++seq.current;
      pending.current.set(id, { resolve });
      if (!workerRef.current) return resolve({ id, ok: false, error: "Worker indisponible." });
      workerRef.current.postMessage({ ...req, id });
    });
  }, []);
}
