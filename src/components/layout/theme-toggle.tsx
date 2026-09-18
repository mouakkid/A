"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";

type Mode = "system" | "light" | "dark";
const KEY = "gma-theme";

export function applyTheme(mode: Mode) {
  const root = document.documentElement;
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.setAttribute("data-theme", dark ? "dark" : "light");
}

const listeners = new Set<() => void>();
function readMode(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, readMode, () => "system" as Mode);
  function change(next: Mode) {
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    applyTheme(next);
    listeners.forEach((l) => l());
  }
  const options: { value: Mode; label: string; icon: typeof Sun }[] = [
    { value: "system", label: "Automatique", icon: MonitorSmartphone },
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
  ];
  return (
    <fieldset className="inline-flex items-center gap-1 rounded-full border border-white/15 p-1">
      <legend className="sr-only">Thème d'affichage</legend>
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => change(value)}
          aria-pressed={mode === value}
          className={`inline-flex size-8 items-center justify-center rounded-full transition ${mode === value ? "bg-white text-graphite-900" : "text-white/70 hover:text-white"}`}
          title={label}
        >
          <Icon className="size-4" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </fieldset>
  );
}
