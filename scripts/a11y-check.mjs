/**
 * Vérification d'accessibilité automatisée (axe-core) sur les pages clés.
 * Usage : BASE=http://127.0.0.1:3100 node scripts/a11y-check.mjs
 * Ne remplace pas une vérification manuelle (clavier, lecteur d'écran).
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = process.env.BASE || "http://127.0.0.1:3100";
const pages = (process.argv[2] || "/,/equipements,/comparer,/quel-garmin-choisir,/guides,/guides/bien-debuter-avec-une-montre-garmin,/outils,/outils/allure-vitesse-temps,/outils/inspecteur-gpx-tcx,/communaute,/connexion,/inscription,/a-propos").split(",");
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
let total = 0;
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport });
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
    const serious = result.violations.filter((v) => ["serious", "critical"].includes(v.impact));
    total += serious.length;
    console.log(`${viewport.width}px ${p}: ${result.violations.length} violation(s), ${serious.length} sérieuse(s)/critique(s)`);
    for (const v of result.violations) console.log(`   - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nœud(s)) ex: ${v.nodes[0]?.target?.[0]}`);
  }
  await page.close();
}
await browser.close();
process.exit(total > 0 ? 1 : 0);
