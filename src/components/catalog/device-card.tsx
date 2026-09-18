import Link from "next/link";
import type { Device } from "@/lib/catalog/types";
import { deviceDisplayName, categoryLabels } from "@/lib/catalog/types";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Badge } from "@/components/ui/badge";

const themeByCategory = { "montre-running": "littoral", "montre-multisport": "atlas", outdoor: "piste", "bien-etre-fitness": "route", "compteur-velo": "route", "capteur-accessoire": "graphite" } as const;

export function DeviceCard({ device, className, headingLevel = "h3" }: { device: Device; className?: string; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const name = deviceDisplayName(device);
  const s = device.spec;
  const facts: string[] = [];
  if (s.display.type) facts.push(`Écran ${s.display.type}`);
  if (s.weightG !== null) facts.push(`${s.weightG} g`);
  if (s.maps.preloadedMaps) facts.push("Cartes intégrées");
  if (s.gnss.multiband) facts.push("GPS multi-bande");
  if (s.features.solar) facts.push("Solaire");
  const watch = s.battery.find((b) => /montre|smartwatch/i.test(b.mode));
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated transition hover:-translate-y-0.5 hover:shadow-md ${className ?? ""}`}>
      <Link href={`/equipements/${device.slug}`} className="block" aria-label={`Fiche ${name}`}>
        <PlaceholderVisual theme={themeByCategory[device.category]} className="aspect-[4/3] w-full" label="Visuel provisoire" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">{categoryLabels[device.category]}</p>
            <Heading className="mt-1 text-lg font-bold leading-tight">
              <Link href={`/equipements/${device.slug}`} className="after:absolute after:inset-0 after:content-['']">{name}</Link>
            </Heading>
          </div>
        </div>
        {device.editorial.positioning && <p className="line-clamp-2 text-sm text-fg-muted">{device.editorial.positioning}</p>}
        <ul className="flex flex-wrap gap-1.5">
          {facts.slice(0, 4).map((f) => (
            <li key={f}><Badge>{f}</Badge></li>
          ))}
          {watch && <li><Badge tone="accent">{watch.claim}</Badge></li>}
        </ul>
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-sm text-fg-muted">
            {s.price ? (
              <>
                <span className="font-semibold text-fg">{s.price.amount.toLocaleString("fr-MA")} {s.price.currency}</span> <span className="text-xs">({s.price.market}, réf.)</span>
              </>
            ) : (
              <span className="text-xs">Prix non vérifié</span>
            )}
          </span>
          <CompareToggle slug={device.slug} name={name} />
        </div>
      </div>
    </article>
  );
}
