import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test.describe("parcours critiques", () => {
  test("accueil : titre, indépendance, CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Tout l'univers Garmin");
    await expect(page.getByText("Communauté indépendante — Non affiliée à Garmin").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Trouver mon Garmin/ })).toBeVisible();
  });

  test("catalogue → fiche → comparateur", async ({ page }) => {
    await page.goto("/equipements");
    const first = page.locator("article h3 a").first();
    await expect(first).toBeVisible();
    const name = (await first.textContent())?.trim();
    await first.click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(name ?? "");
    await expect(page.getByText("Caractéristiques")).toBeVisible();
    await page.goto("/equipements");
    const toggles = page.getByRole("button", { name: /Comparer —/ });
    await toggles.nth(0).click();
    await toggles.nth(1).click();
    await page.getByRole("region", { name: "Sélection pour le comparateur" }).getByRole("link", { name: /Comparer \(2\)/ }).click();
    await expect(page).toHaveURL(/\/comparer\?m=/);
    await expect(page.getByText("Afficher uniquement les différences")).toBeVisible();
  });

  test("assistant : neuf questions → recommandations", async ({ page }) => {
    await page.goto("/quel-garmin-choisir");
    for (let i = 0; i < 9; i++) {
      const fieldset = page.locator("fieldset");
      const inputs = fieldset.locator("input");
      const type = await inputs.first().getAttribute("type");
      if (type === "radio") await inputs.first().check();
      await page.getByRole("button", { name: /Suivant|Voir les recommandations/ }).click();
    }
    await expect(page.getByRole("heading", { name: "Vos recommandations" })).toBeVisible();
    await expect(page.locator("article").first()).toContainText("Pourquoi");
  });

  test("outil allure : calcul et passages", async ({ page }) => {
    await page.goto("/outils/allure-vitesse-temps?mode=pace&allure=5:00&d=10k");
    await expect(page.getByRole("definition").filter({ hasText: "50:00" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tableau de passages" })).toBeVisible();
  });

  test("inspecteur GPX : fichier valide et fichier malveillant", async ({ page }) => {
    await page.goto("/outils/inspecteur-gpx-tcx");
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({ name: "test.gpx", mimeType: "application/gpx+xml", buffer: readFileSync("tests/fixtures/sample-activity.gpx") });
    await expect(page.getByText("Champs présents")).toBeVisible();
    await expect(page.getByText("Fréquence cardiaque", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Analyser un autre fichier" }).click();
    await input.setInputFiles({ name: "xxe.gpx", mimeType: "application/gpx+xml", buffer: readFileSync("tests/fixtures/malicious-xxe.gpx") });
    await expect(page.getByText(/déclaration DOCTYPE/)).toBeVisible();
  });

  test("inscription → sujet de forum → réponse persistée", async ({ page }) => {
    const id = Date.now().toString(36);
    await page.goto("/inscription");
    await page.getByLabel("Pseudonyme").fill(`e2e_${id}`);
    await page.getByLabel("Adresse e-mail").fill(`e2e_${id}@example.test`);
    await page.getByLabel("Mot de passe").fill("motdepasse-e2e-solide");
    await page.getByLabel(/J'ai lu les/).check();
    await page.getByRole("button", { name: "Créer mon compte" }).click();
    await expect(page).toHaveURL(/\/compte/);
    await page.goto("/communaute/nouveau");
    await page.getByLabel("Titre").fill(`Question de test e2e ${id}`);
    await page.getByLabel("Message").fill("Ceci est un message de test automatisé, suffisamment long pour passer la validation.");
    await page.getByRole("button", { name: "Publier le sujet" }).click();
    await expect(page).toHaveURL(/\/communaute\/sujet\//);
    // Compte créé il y a < 24 h : le sujet est en attente et visible par son auteur.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(`Question de test e2e ${id}`);
    await expect(page.getByText(/en attente de relecture/)).toBeVisible();
  });

  test("404 réelle", async ({ page }) => {
    const res = await page.goto("/page-qui-n-existe-pas");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Cette page n'existe pas.")).toBeVisible();
  });
});
