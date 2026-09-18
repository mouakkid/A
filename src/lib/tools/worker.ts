/// <reference lib="webworker" />
import { checkXmlSafety } from "./xml-safety";
import { parseGpx, buildGpx } from "./gpx";
import { parseTcx, buildTcx } from "./tcx";
import { analyzeActivity, type AnalysisSummary } from "./analyze";
import { anonymizeStartEnd } from "./privacy";
import { allPoints, type ActivityModel } from "./activity-model";

export type WorkerRequest =
  | { id: number; op: "analyze"; text: string; byteLength: number }
  | { id: number; op: "convert"; text: string; byteLength: number; to: "gpx" | "tcx"; sport?: string }
  | { id: number; op: "privacy"; text: string; byteLength: number; startRadiusM: number; endRadiusM: number; dropWaypoints: boolean; stripNames: boolean };

export type Coords = [number, number][];
export type WorkerResponse =
  | { id: number; ok: true; op: "analyze"; summary: AnalysisSummary; coords: Coords; elevation: number[] }
  | { id: number; ok: true; op: "convert"; xml: string; report: { kept: string[]; transformed: string[]; lost: string[] }; from: "gpx" | "tcx"; kind: string; summaryBefore: AnalysisSummary; summaryAfter: AnalysisSummary }
  | { id: number; ok: true; op: "privacy"; xml: string; before: Coords; after: Coords; removedStart: number; removedEnd: number; removedWaypoints: number; kept: number; notes: string[]; format: "gpx" | "tcx" }
  | { id: number; ok: false; error: string };

function detect(text: string): "gpx" | "tcx" {
  return /<\s*TrainingCenterDatabase\b/i.test(text.slice(0, 4096)) ? "tcx" : "gpx";
}
function parse(text: string): ActivityModel {
  return detect(text) === "tcx" ? parseTcx(text) : parseGpx(text);
}
function coordsOf(model: ActivityModel, max = 5000): Coords {
  const pts = allPoints(model).filter((p) => p.lat !== null && p.lon !== null) as { lat: number; lon: number }[];
  const step = Math.max(1, Math.ceil(pts.length / max));
  const out: Coords = [];
  for (let i = 0; i < pts.length; i += step) out.push([pts[i].lat, pts[i].lon]);
  if (pts.length && (pts.length - 1) % step !== 0) out.push([pts[pts.length - 1].lat, pts[pts.length - 1].lon]);
  return out;
}
function elevationOf(model: ActivityModel, max = 600): number[] {
  const eles = allPoints(model).map((p) => p.ele).filter((e): e is number => e !== null);
  const step = Math.max(1, Math.ceil(eles.length / max));
  const out: number[] = [];
  for (let i = 0; i < eles.length; i += step) out.push(eles[i]);
  return out;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  const reply = (r: WorkerResponse) => (self as unknown as Worker).postMessage(r);
  try {
    const safety = checkXmlSafety(req.text, req.byteLength);
    if (!safety.ok) return reply({ id: req.id, ok: false, error: safety.error });
    if (req.op === "analyze") {
      const model = parse(req.text);
      return reply({ id: req.id, ok: true, op: "analyze", summary: analyzeActivity(model), coords: coordsOf(model), elevation: elevationOf(model) });
    }
    if (req.op === "convert") {
      const from = detect(req.text);
      const model = parse(req.text);
      const built = req.to === "gpx" ? buildGpx(model) : buildTcx(model, { sport: req.sport });
      const after = req.to === "gpx" ? parseGpx(built.xml) : parseTcx(built.xml);
      return reply({ id: req.id, ok: true, op: "convert", xml: built.xml, report: built.report, from, kind: model.kind, summaryBefore: analyzeActivity(model), summaryAfter: analyzeActivity(after) });
    }
    if (req.op === "privacy") {
      const format = detect(req.text);
      const model = parse(req.text);
      const r = anonymizeStartEnd(model, { startRadiusM: req.startRadiusM, endRadiusM: req.endRadiusM, dropWaypoints: req.dropWaypoints, stripMetadataName: req.stripNames });
      const built = format === "gpx" ? buildGpx(r.model) : buildTcx(r.model);
      return reply({ id: req.id, ok: true, op: "privacy", xml: built.xml, before: coordsOf(model), after: coordsOf(r.model), removedStart: r.removedStart, removedEnd: r.removedEnd, removedWaypoints: r.removedWaypoints, kept: r.kept, notes: r.notes, format });
    }
  } catch (err) {
    reply({ id: req.id, ok: false, error: err instanceof Error ? err.message : "Erreur de traitement." });
  }
};
