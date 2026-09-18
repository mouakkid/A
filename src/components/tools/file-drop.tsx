"use client";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { MAX_FILE_BYTES } from "@/lib/tools/xml-safety";
import { cn } from "@/lib/utils/cn";

export type LoadedFile = { name: string; size: number; text: string };

export function FileDrop({ onFile, accept = ".gpx,.tcx,application/gpx+xml,application/xml,text/xml", label = "Déposez un fichier GPX ou TCX ici, ou cliquez pour choisir" }: { onFile: (f: LoadedFile) => void; accept?: string; label?: string }) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) return setError(`Fichier trop volumineux (${(file.size / 1048576).toFixed(1)} Mo, maximum 25 Mo).`);
    if (file.size === 0) return setError("Le fichier est vide.");
    try {
      const text = await file.text();
      onFile({ name: file.name, size: file.size, text });
    } catch {
      setError("Impossible de lire ce fichier.");
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
        className={cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition", drag ? "border-accent bg-accent-soft" : "border-border-strong hover:border-fg")}
      >
        <UploadCloud className="size-8 text-accent" aria-hidden />
        <p className="mt-3 font-medium">{label}</p>
        <p className="mt-1 text-xs text-fg-subtle">Traitement local dans votre navigateur · 25 Mo maximum</p>
        <input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={(e) => handle(e.target.files?.[0])} />
      </div>
      {error && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{error}</p>}
    </div>
  );
}

export function downloadText(name: string, text: string, mime = "application/xml") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
