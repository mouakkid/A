"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, RotateCcw, Link2 } from "lucide-react";
import type { Device } from "@/lib/catalog/types";
import { sportKeys, sportLabels, deviceDisplayName } from "@/lib/catalog/types";
import { recommend, type Answers, type Recommendation } from "@/lib/recommend/engine";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type Step = { key: keyof Answers; title: string; help?: string; multi?: boolean; options: { value: string; label: string; hint?: string }[] };

const steps: Step[] = [
  { key: "mainSport", title: "Votre sport principal", options: sportKeys.map((k) => ({ value: k, label: sportLabels[k] })) },
  { key: "secondarySports", title: "Sports secondaires", help: "Facultatif, plusieurs choix possibles.", multi: true, options: sportKeys.map((k) => ({ value: k, label: sportLabels[k] })) },
  {
    key: "budget",
    title: "Votre budget",
    help: "Exprimé par rapport au prix constructeur de référence (EUR, marché FR) affiché sur nos fiches ; ce n'est pas un prix marocain.",
    options: [
      { value: "moins-300", label: "Moins de 300 €" },
      { value: "300-500", label: "300 à 500 €" },
      { value: "500-800", label: "500 à 800 €" },
      { value: "plus-800", label: "Plus de 800 €" },
      { value: "indifferent", label: "Sans contrainte" },
    ],
  },
  {
    key: "level",
    title: "Votre niveau",
    options: [
      { value: "debutant", label: "Débutant", hint: "Je commence ou je reprends" },
      { value: "intermediaire", label: "Intermédiaire", hint: "Je m'entraîne régulièrement" },
      { value: "confirme", label: "Confirmé", hint: "Je suis un plan, je vise des objectifs" },
    ],
  },
  { key: "frequency", title: "Fréquence d'entraînement", options: [{ value: "1-2", label: "1 à 2 séances par semaine" }, { value: "3-4", label: "3 à 4 séances" }, { value: "5-plus", label: "5 séances ou plus" }] },
  {
    key: "priority",
    title: "Votre priorité",
    options: [
      { value: "autonomie", label: "Autonomie", hint: "Longues sorties, peu de recharges" },
      { value: "ecran", label: "Écran", hint: "Lisibilité et couleurs en intérieur" },
      { value: "equilibre", label: "Équilibre", hint: "Pas de préférence marquée" },
    ],
  },
  { key: "size", title: "Taille préférée", options: [{ value: "compact", label: "Compacte" }, { value: "standard", label: "Standard" }, { value: "large", label: "Grande" }, { value: "indifferent", label: "Indifférent" }] },
  { key: "maps", title: "Besoin de cartographie ?", help: "Cartes préchargées sur l'appareil, pas seulement le suivi d'une trace.", options: [{ value: "oui", label: "Oui, indispensable" }, { value: "non", label: "Non" }, { value: "indifferent", label: "Indifférent" }] },
  {
    key: "extras",
    title: "Fonctions particulières",
    help: "Facultatif, plusieurs choix possibles.",
    multi: true,
    options: [
      { value: "musique", label: "Musique embarquée" },
      { value: "paiement", label: "Paiement sans contact" },
      { value: "solaire", label: "Recharge solaire" },
      { value: "lampe", label: "Lampe torche" },
      { value: "triathlon", label: "Profil triathlon" },
      { value: "ecg", label: "ECG" },
    ],
  },
];

const defaults: Answers = { mainSport: "running", secondarySports: [], budget: "indifferent", level: "intermediaire", frequency: "3-4", priority: "equilibre", size: "indifferent", maps: "indifferent", extras: [] };

function fromParams(sp: URLSearchParams): { answers: Answers; done: boolean } | null {
  if (!sp.get("sport")) return null;
  const a: Answers = {
    mainSport: (sp.get("sport") as Answers["mainSport"]) ?? defaults.mainSport,
    secondarySports: (sp.get("sec")?.split(",").filter(Boolean) as Answers["secondarySports"]) ?? [],
    budget: (sp.get("budget") as Answers["budget"]) ?? defaults.budget,
    level: (sp.get("niveau") as Answers["level"]) ?? defaults.level,
    frequency: (sp.get("freq") as Answers["frequency"]) ?? defaults.frequency,
    priority: (sp.get("prio") as Answers["priority"]) ?? defaults.priority,
    size: (sp.get("taille") as Answers["size"]) ?? defaults.size,
    maps: (sp.get("cartes") as Answers["maps"]) ?? defaults.maps,
    extras: (sp.get("extras")?.split(",").filter(Boolean) as Answers["extras"]) ?? [],
  };
  return { answers: a, done: true };
}
function toParams(a: Answers): string {
  const p = new URLSearchParams();
  p.set("sport", a.mainSport);
  if (a.secondarySports.length) p.set("sec", a.secondarySports.join(","));
  p.set("budget", a.budget);
  p.set("niveau", a.level);
  p.set("freq", a.frequency);
  p.set("prio", a.priority);
  p.set("taille", a.size);
  p.set("cartes", a.maps);
  if (a.extras.length) p.set("extras", a.extras.join(","));
  return p.toString();
}

export function Advisor({ devices }: { devices: Device[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = useMemo(() => fromParams(new URLSearchParams(sp.toString())), [sp]);
  const [answers, setAnswers] = useState<Answers>(initial?.answers ?? defaults);
  const [step, setStep] = useState(initial ? steps.length : 0);
  const done = step >= steps.length;

  // Synchronisation avec l'URL (partage de résultat) dérivée pendant le rendu.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    if (initial) {
      setAnswers(initial.answers);
      setStep(steps.length);
    }
  }

  const result = useMemo(() => (done ? recommend(devices, answers) : null), [done, devices, answers]);
  const current = steps[step];

  function set(key: keyof Answers, value: string) {
    setAnswers((a) => {
      const s = steps.find((x) => x.key === key)!;
      if (s.multi) {
        const arr = (a[key] as string[]).includes(value) ? (a[key] as string[]).filter((v) => v !== value) : [...(a[key] as string[]), value];
        return { ...a, [key]: arr };
      }
      return { ...a, [key]: value };
    });
  }
  function next() {
    if (step === steps.length - 1) router.replace(`/quel-garmin-choisir?${toParams(answers)}`, { scroll: false });
    setStep((s) => s + 1);
  }
  function reset() {
    setAnswers(defaults);
    setStep(0);
    router.replace("/quel-garmin-choisir", { scroll: false });
  }

  if (devices.length === 0) {
    return <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-fg-muted">Aucune fiche équipement n'est publiée : l'assistant ne peut pas encore formuler de recommandation.</p>;
  }

  if (!done) {
    const value = answers[current.key];
    const canContinue = true; // chaque question a une valeur par défaut valide
    return (
      <div className="mx-auto max-w-2xl">
        <ol className="flex gap-1.5" aria-label="Progression">
          {steps.map((s, i) => (
            <li key={s.key} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-accent" : "bg-border")} aria-current={i === step ? "step" : undefined} />
          ))}
        </ol>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-fg-subtle">Question {step + 1} sur {steps.length}</p>
        <fieldset className="mt-2 animate-reveal" key={current.key}>
          <legend className="text-2xl font-bold sm:text-3xl">{current.title}</legend>
          {current.help && <p className="mt-2 text-sm text-fg-muted">{current.help}</p>}
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {current.options.map((o) => {
              const selected = current.multi ? (value as string[]).includes(o.value) : value === o.value;
              return (
                <label key={o.value} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition", selected ? "border-accent bg-accent-soft" : "border-border hover:border-fg")}>
                  <input type={current.multi ? "checkbox" : "radio"} name={current.key} value={o.value} checked={selected} onChange={() => set(current.key, o.value)} className="mt-1 size-4" />
                  <span>
                    <span className="block font-medium">{o.label}</span>
                    {o.hint && <span className="block text-xs text-fg-muted">{o.hint}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft className="size-4" aria-hidden />Précédent</Button>
          <Button type="button" onClick={next} disabled={!canContinue}>{step === steps.length - 1 ? "Voir les recommandations" : "Suivant"}<ArrowRight className="size-4" aria-hidden /></Button>
        </div>
      </div>
    );
  }

  const r = result!;
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Vos recommandations</h2>
          <p className="mt-1 text-sm text-fg-muted">Pour {sportLabels[answers.mainSport]} · budget {steps[2].options.find((o) => o.value === answers.budget)?.label} · priorité {answers.priority}.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setStep(0)}><ArrowLeft className="size-4" aria-hidden />Modifier</Button>
          <Button type="button" variant="ghost" size="sm" onClick={reset}><RotateCcw className="size-4" aria-hidden />Recommencer</Button>
        </div>
      </div>

      {r.insufficientData && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Les fiches publiées ne permettent pas encore une recommandation solide pour ces réponses : peu de modèles correspondent ou des données clés sont « Non vérifié ». Les propositions ci-dessous sont à prendre avec prudence.
        </p>
      )}

      <ol className="grid gap-6 lg:grid-cols-3">
        {r.recommendations.map((rec, i) => (
          <li key={rec.device.slug} className={cn("reveal", i === 1 && "reveal-delay-1", i === 2 && "reveal-delay-2")}>
            <RecommendationCard rec={rec} rank={i + 1} />
          </li>
        ))}
      </ol>

      {r.differences.length > 0 && (
        <section className="rounded-2xl border border-border p-6">
          <h3 className="font-bold">Ce qui distingue ces propositions</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-fg-muted">
            {r.differences.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={`/comparer?m=${r.recommendations.map((x) => x.device.slug).join(",")}`} size="sm">Comparer ces modèles en détail</ButtonLink>
            <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-bg-muted"><Link2 className="size-4" aria-hidden />Copier le lien de ce résultat</button>
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-bg-muted p-6 text-sm text-fg-muted">
        <h3 className="font-bold text-fg">Comment ce résultat est calculé</h3>
        <p className="mt-2">{r.explanation}</p>
        <p className="mt-2">Les fiches sont mises à jour progressivement ; une donnée « Non vérifié » n'est jamais comptée comme un défaut. Le résultat n'est pas un conseil d'achat garanti : lisez les fiches, comparez, et posez vos questions sur le forum.</p>
      </section>
    </div>
  );
}

function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  const d = rec.device;
  const name = deviceDisplayName(d);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-bg-elevated p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong dark:text-accent">Proposition {rank}</p>
      <h3 className="mt-1 text-xl font-bold"><Link href={`/equipements/${d.slug}`} className="hover:underline">{name}</Link></h3>
      {d.editorial.positioning && <p className="mt-2 text-sm text-fg-muted">{d.editorial.positioning}</p>}
      <h4 className="mt-5 text-sm font-semibold">Pourquoi</h4>
      <ul className="mt-2 space-y-1.5 text-sm">
        {rec.reasons.map((x) => (
          <li key={x.text} className={cn("flex gap-2", x.kind === "plus" ? "text-fg" : x.kind === "minus" ? "text-danger" : "text-fg-muted")}>
            <span aria-hidden className="shrink-0 font-bold">{x.kind === "plus" ? "+" : x.kind === "minus" ? "−" : "·"}</span>
            {x.text}
          </li>
        ))}
      </ul>
      {rec.tradeoffs.length > 0 && (
        <>
          <h4 className="mt-4 text-sm font-semibold">Compromis</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-muted">
            {rec.tradeoffs.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </>
      )}
      {rec.relevantFeatures.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {rec.relevantFeatures.map((f) => <Badge key={f} tone="accent">{f}</Badge>)}
        </div>
      )}
      <div className="mt-auto pt-5">
        <ButtonLink href={`/equipements/${d.slug}`} variant="secondary" size="sm" className="w-full">Voir la fiche</ButtonLink>
      </div>
    </article>
  );
}
