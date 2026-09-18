import type { AnalysisSummary } from "@/lib/tools/analyze";
import { formatDuration } from "@/lib/tools/pace";
import { formatDateTime } from "@/lib/utils/format";

const fieldLabels: Record<string, string> = { lat: "Latitude", lon: "Longitude", ele: "Altitude", time: "Horodatage", hr: "Fréquence cardiaque", cad: "Cadence", power: "Puissance", temp: "Température", distance: "Distance cumulée", speed: "Vitesse" };
const kindLabels: Record<string, string> = { activity: "Activité (horodatée)", track: "Trace (sans horodatage)", route: "Itinéraire", course: "Parcours (Course TCX)", "waypoints-only": "Points d'intérêt uniquement" };

export function SummaryView({ s, compact = false }: { s: AnalysisSummary; compact?: boolean }) {
  const stats: [string, string][] = [
    ["Type", `${kindLabels[s.kind] ?? s.kind} · ${s.format.toUpperCase()}`],
    ["Points", s.pointCount.toLocaleString("fr-MA")],
    ["Distance", s.distanceM !== null ? `${(s.distanceM / 1000).toFixed(2).replace(".", ",")} km` : "—"],
    ["Durée", s.durationSec !== null ? formatDuration(s.durationSec) : "—"],
    ["D+ / D−", s.elevationGainM !== null ? `${Math.round(s.elevationGainM)} m / ${Math.round(s.elevationLossM ?? 0)} m` : "—"],
    ["FC moyenne / max", s.avgHr !== null ? `${Math.round(s.avgHr)} / ${s.maxHr} bpm` : "—"],
  ];
  return (
    <div className="space-y-5">
      <dl className={`grid gap-3 ${compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border p-3">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-subtle">{k}</dt>
            <dd className="mt-0.5 font-display text-lg font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      {!compact && (
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div><dt className="inline text-fg-muted">Nom : </dt><dd className="inline">{s.name ?? "—"}</dd></div>
          <div><dt className="inline text-fg-muted">Créateur : </dt><dd className="inline">{s.creator ?? "—"}</dd></div>
          <div><dt className="inline text-fg-muted">Sport : </dt><dd className="inline">{s.sport ?? "—"}</dd></div>
          <div><dt className="inline text-fg-muted">Traces / segments / itinéraires : </dt><dd className="inline">{s.trackCount} / {s.segmentCount} / {s.routeCount}</dd></div>
          <div><dt className="inline text-fg-muted">Waypoints / tours : </dt><dd className="inline">{s.waypointCount} / {s.lapCount}</dd></div>
          <div><dt className="inline text-fg-muted">Début (Casablanca) : </dt><dd className="inline">{s.startTime ? formatDateTime(s.startTime) : "—"}</dd></div>
          <div><dt className="inline text-fg-muted">Fin (Casablanca) : </dt><dd className="inline">{s.endTime ? formatDateTime(s.endTime) : "—"}</dd></div>
          <div><dt className="inline text-fg-muted">Altitude min / max : </dt><dd className="inline">{s.minEle !== null ? `${Math.round(s.minEle)} / ${Math.round(s.maxEle ?? 0)} m` : "—"}</dd></div>
          {s.avgCad !== null && <div><dt className="inline text-fg-muted">Cadence moyenne : </dt><dd className="inline">{Math.round(s.avgCad)}</dd></div>}
          {s.avgPower !== null && <div><dt className="inline text-fg-muted">Puissance moyenne : </dt><dd className="inline">{Math.round(s.avgPower)} W</dd></div>}
        </dl>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">Champs présents</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {Object.keys(fieldLabels).map((k) => (
            <li key={k} className={`rounded-full border px-2.5 py-0.5 text-xs ${s.fields.includes(k) ? "border-accent bg-accent-soft font-medium" : "border-border text-fg-subtle line-through"}`}>{fieldLabels[k]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AnomalyList({ s }: { s: AnalysisSummary }) {
  const all = [...s.warnings.map((w) => ({ severity: "warning" as const, message: w })), ...s.anomalies];
  if (!all.length) return <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">Aucune anomalie plausible détectée.</p>;
  return (
    <ul className="space-y-2">
      {all.map((a) => (
        <li key={a.message} className={`rounded-xl border p-3 text-sm ${a.severity === "warning" ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200" : "border-border bg-bg-muted text-fg-muted"}`}>
          <span className="font-medium">{a.severity === "warning" ? "Attention : " : "Info : "}</span>{a.message}
        </li>
      ))}
    </ul>
  );
}

export function ElevationProfile({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const W = 800, H = 160, pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((e, i) => [pad + (i / (data.length - 1)) * (W - pad * 2), H - pad - ((e - min) / span) * (H - pad * 2)] as const);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-border bg-bg-muted" role="img" aria-label={`Profil d'altitude de ${Math.round(min)} à ${Math.round(max)} m`}>
        <path d={`${d} L${pts[pts.length - 1][0]} ${H - pad} L${pts[0][0]} ${H - pad} Z`} fill="#1d6ef5" fillOpacity="0.15" />
        <path d={d} fill="none" stroke="#1d6ef5" strokeWidth="2" />
      </svg>
      <figcaption className="mt-1 text-xs text-fg-subtle">Profil d'altitude (échantillonné) : {Math.round(min)} m → {Math.round(max)} m</figcaption>
    </figure>
  );
}
