"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Coords } from "@/lib/tools/worker";

/** Tracé SVG (aucune requête externe) avec option d'affichage sur carte (tuiles externes, chargement à la demande). */
export function TrackPreview({ coords, secondary, height = 320 }: { coords: Coords; secondary?: Coords; height?: number }) {
  const [map, setMap] = useState(false);
  const tilesUrl = process.env.NEXT_PUBLIC_MAP_TILES_URL;
  const box = useMemo(() => bbox([...(coords ?? []), ...(secondary ?? [])]), [coords, secondary]);
  if (!coords.length) return <p className="rounded-2xl border border-dashed border-border-strong p-6 text-center text-sm text-fg-muted">Aucun point géolocalisé à afficher.</p>;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-fg-subtle">{map ? "Fond de carte : fournisseur de tuiles externe (voir confidentialité)." : "Tracé rendu localement, sans fond de carte ni requête externe."}</p>
        {tilesUrl && (
          <button type="button" onClick={() => setMap((m) => !m)} className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-bg-muted">
            {map ? "Masquer la carte" : "Afficher sur une carte (contacte un serveur de tuiles)"}
          </button>
        )}
      </div>
      {map && tilesUrl ? <LeafletMap coords={coords} secondary={secondary} height={height} /> : <SvgTrack coords={coords} secondary={secondary} box={box} height={height} />}
    </div>
  );
}

function bbox(c: Coords) {
  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
  for (const [la, lo] of c) { if (la < minLat) minLat = la; if (la > maxLat) maxLat = la; if (lo < minLon) minLon = lo; if (lo > maxLon) maxLon = lo; }
  return { minLat, maxLat, minLon, maxLon };
}

function SvgTrack({ coords, secondary, box, height }: { coords: Coords; secondary?: Coords; box: ReturnType<typeof bbox>; height: number }) {
  const W = 800, H = height * 2;
  const pad = 24;
  const midLat = ((box.minLat + box.maxLat) / 2) * (Math.PI / 180);
  const kx = Math.cos(midLat) || 1; // correction approximative de la projection
  const spanLon = (box.maxLon - box.minLon) * kx || 1e-6;
  const spanLat = box.maxLat - box.minLat || 1e-6;
  const scale = Math.min((W - pad * 2) / spanLon, (H - pad * 2) / spanLat);
  const ox = (W - spanLon * scale) / 2, oy = (H - spanLat * scale) / 2;
  const toXY = ([la, lo]: [number, number]) => [ox + (lo - box.minLon) * kx * scale, H - (oy + (la - box.minLat) * scale)] as const;
  const path = (c: Coords) => c.map((p, i) => `${i === 0 ? "M" : "L"}${toXY(p).map((v) => v.toFixed(1)).join(" ")}`).join(" ");
  const start = toXY(coords[0]), end = toXY(coords[coords.length - 1]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl border border-border bg-bg-muted bg-topo-dark" role="img" aria-label="Tracé de l'activité">
      {secondary && <path d={path(secondary)} fill="none" stroke="#c02626" strokeOpacity="0.45" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />}
      <path d={path(coords)} fill="none" stroke="#1d6ef5" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={start[0]} cy={start[1]} r="9" fill="#158a4b" stroke="#fff" strokeWidth="3" />
      <circle cx={end[0]} cy={end[1]} r="9" fill="#c02626" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

function LeafletMap({ coords, secondary, height }: { coords: Coords; secondary?: Coords; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let mapInstance: import("leaflet").Map | null = null;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "/leaflet/leaflet.css";
        document.head.appendChild(link);
      }
      if (disposed || !ref.current) return;
      mapInstance = L.map(ref.current, { scrollWheelZoom: false });
      L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILES_URL!, { attribution: process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION ?? "", maxZoom: 19 }).addTo(mapInstance);
      if (secondary?.length) L.polyline(secondary, { color: "#c02626", opacity: 0.5, weight: 5 }).addTo(mapInstance);
      const line = L.polyline(coords, { color: "#1d6ef5", weight: 4 }).addTo(mapInstance);
      L.circleMarker(coords[0], { radius: 6, color: "#fff", fillColor: "#158a4b", fillOpacity: 1 }).addTo(mapInstance);
      L.circleMarker(coords[coords.length - 1], { radius: 6, color: "#fff", fillColor: "#c02626", fillOpacity: 1 }).addTo(mapInstance);
      mapInstance.fitBounds(line.getBounds(), { padding: [20, 20] });
    })();
    return () => { disposed = true; mapInstance?.remove(); };
  }, [coords, secondary]);
  return <div ref={ref} style={{ height }} className="w-full overflow-hidden rounded-2xl border border-border" aria-label="Carte du tracé" />;
}
