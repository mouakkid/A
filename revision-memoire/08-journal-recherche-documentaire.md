# Journal de recherche documentaire — première passe exécutée

**Version :** 1.0 — exécutée le 7 août 2026 · **Statut : première passe sur bases ouvertes, terminée et consignée.** Ce journal applique le protocole `03-protocole-recherche-documentaire.md` (A05/A06). Il rend reproductible ce qui a été réellement interrogé — ni plus, ni moins.

## 1. Périmètre réellement couvert par cette passe

| Base | Statut | Rôle |
|---|---|---|
| Crossref REST API (`api.crossref.org`) | **Interrogée** (recherche bibliographique + vérification unitaire des DOI) | Base principale de cette passe — la même que celle utilisée par l'audit pour le contrôle des DOI |
| Semantic Scholar Graph API | **Interrogée** (1 requête par axe) | Recoupement par pertinence |
| OpenAlex | **Tentée — échec HTTP 429** (limitation de débit, consignée) | À réexécuter ultérieurement |
| Scopus, Web of Science, EBSCO Business Source, ProQuest, APA PsycINFO, Cairn.info | **Non interrogées** (accès institutionnel requis) | Passes restantes — indispensables avant toute affirmation de lacune dans le mémoire |
| Google Scholar | **Non exécutée** | Complément prévu au protocole §3 |

**Fenêtre :** 2023‑01‑01 → 2026‑08‑07 · **Type :** articles de revues (`type:journal-article`) · **Langues :** interfaces en anglais (la couverture francophone est faible sur ces bases — la passe Cairn.info reste nécessaire).

## 2. Requêtes exécutées

24 requêtes consignées. Les URL exactes, horodatages et paramètres complets sont dans `recherche-documentaire/queries_log.json` ; les réponses brutes intégrales sont archivées dans `recherche-documentaire/raw/` (audit trail). Les scripts d'exécution (`harvest.py`, `verify_selection.py`) sont versionnés dans le même répertoire — la passe est rejouable à l'identique.
| Date (UTC) | Base | Axe | Résultats totaux | Notices exportées | Fichier brut |
|---|---|---|---|---|---|
| 2026-08-07 13:12 | Crossref | A1 | 1 568 030 | 25 | `crossref_A1_q1.json` |
| 2026-08-07 13:12 | Crossref | A1 | 2 234 445 | 25 | `crossref_A1_q2.json` |
| 2026-08-07 13:12 | Semantic Scholar | A1 | échec | 0 | `—` |
| 2026-08-07 13:12 | Crossref | A2 | 1 564 245 | 25 | `crossref_A2_q1.json` |
| 2026-08-07 13:12 | Crossref | A2 | 1 079 719 | 25 | `crossref_A2_q2.json` |
| 2026-08-07 13:13 | Semantic Scholar | A2 | 1 312 | 25 | `s2_A2.json` |
| 2026-08-07 13:13 | Crossref | A3 | 1 020 394 | 25 | `crossref_A3_q1.json` |
| 2026-08-07 13:13 | Crossref | A3 | 1 290 148 | 25 | `crossref_A3_q2.json` |
| 2026-08-07 13:13 | Semantic Scholar | A3 | échec | 0 | `—` |
| 2026-08-07 13:13 | Crossref | A4 | 391 153 | 25 | `crossref_A4_q1.json` |
| 2026-08-07 13:13 | Crossref | A4 | 382 730 | 25 | `crossref_A4_q2.json` |
| 2026-08-07 13:13 | Semantic Scholar | A4 | 1 963 | 25 | `s2_A4.json` |
| 2026-08-07 13:13 | Crossref | A5 | 404 118 | 25 | `crossref_A5_q1.json` |
| 2026-08-07 13:13 | Crossref | A5 | 408 311 | 25 | `crossref_A5_q2.json` |
| 2026-08-07 13:14 | Semantic Scholar | A5 | 290 | 25 | `s2_A5.json` |
| 2026-08-07 13:14 | Crossref | A6 | 1 660 932 | 25 | `crossref_A6_q1.json` |
| 2026-08-07 13:14 | Crossref | A6 | 606 786 | 25 | `crossref_A6_q2.json` |
| 2026-08-07 13:14 | Semantic Scholar | A6 | 84 | 25 | `s2_A6.json` |
| 2026-08-07 13:14 | Crossref | A7 | 357 188 | 25 | `crossref_A7_q1.json` |
| 2026-08-07 13:14 | Crossref | A7 | 332 221 | 25 | `crossref_A7_q2.json` |
| 2026-08-07 13:15 | Semantic Scholar | A7 | 652 | 25 | `s2_A7.json` |
| 2026-08-07 13:16 | Crossref | A4 | 517 519 | 25 | `crossref_A4_S1.json` |
| 2026-08-07 13:16 | Crossref | A6 | 1 105 562 | 25 | `crossref_A6_S2.json` |
| 2026-08-07 13:16 | Crossref | A6 | 1 628 673 | 25 | `crossref_A6_S3.json` |
## 3. Procédure de tri appliquée

1. **Dédoublonnage** par DOI (au sein de chaque axe, puis entre axes lors de la sélection finale).
2. **Tri qualitatif sur titre, résumé et revue**, selon les critères du protocole (§5) : pertinence pour l'axe **et** dimension RH/organisationnelle ; publication évaluée par les pairs ; qualité de la revue.
3. **Exclusions notables**, motifs consignés : préprints SSRN (non évalués — réintégrables uniquement en appoint signalé) ; revues d'apparence prédatrice ou hors discipline ; travaux XAI purement techniques (imagerie médicale, cybersécurité, IoT…) remontés par les requêtes de l'axe 4 mais sans objet RH/managérial ; doublons de corrections d'articles (errata).
4. **Vérification unitaire** de chaque référence retenue via `api.crossref.org/works/{doi}` : 39 références vérifiées, **0 échec** (une référence a nécessité une nouvelle tentative après un HTTP 429 ; résolue). Détail complet : `recherche-documentaire/selection_verifiee.json`.

## 4. Résultat de la passe

- **39 références candidates 2023–2026 vérifiées** (existence et métadonnées), classées en deux niveaux : **A** = revues établies du champ (Human Resource Management Review, Human Resource Management, HRMJ, IJHRM, British Journal of Management, Journal of Business and Psychology, Technological Forecasting and Social Change, Human Relations…) ; **B** = compléments dont la qualité de support est à évaluer avant usage. → Registre complet : `09-registre-references-verifiees.md`.
- Ces références sont des **candidates à l'intégration** : la lecture intégrale de chaque texte est requise avant toute citation dans le mémoire (la vérification atteste l'existence et les métadonnées, pas le contenu).

## 5. Constat documenté : rareté des travaux Maroc/Maghreb × IA × RH

Les requêtes dédiées (axe 6, requêtes S2 et S3 du journal) n'ont fait remonter, parmi les résultats classés par pertinence, **quasiment aucun article évalué par les pairs portant spécifiquement sur l'IA en GRH au Maroc ou au Maghreb** — une seule source marocaine candidate a été retenue (cadre juridique marocain de l'IA, niveau B). Ce constat :

- **peut désormais être affirmé de manière référencée** dans le mémoire, au périmètre près : « au terme des interrogations consignées (Crossref, Semantic Scholar, 2023–2026, journal en annexe), aucune étude évaluée par les pairs portant sur [objet précis] n'a été identifiée » ;
- **ne doit pas être généralisé** avant les passes restantes : Cairn.info (littérature francophone), Scopus/WoS et Google Scholar peuvent indexer des travaux marocains absents de Crossref/Semantic Scholar. La formulation définitive attend ces passes.

## 6. Limites de cette passe

1. Bases institutionnelles non interrogées (accès requis) ; couverture francophone faible ; OpenAlex indisponible (429).
2. Le classement par pertinence de Crossref est lexical : des travaux pertinents formulés différemment peuvent échapper aux requêtes — d'où les variantes de requêtes et le recoupement Semantic Scholar.
3. La sélection qualitative (niveaux A/B) est un jugement d'expertise documenté, pas un verdict : l'auteur et l'encadrante valident la liste finale.
4. Aucune de ces références n'est encore citée dans le mémoire : l'intégration se fera chapitre par chapitre, après lecture intégrale, lors de la révision de la revue (dès AF‑01).

## 7. Prochaines étapes

1. Lecture intégrale et fiche d'extraction pour chaque référence retenue (grille du protocole §6).
2. Passes institutionnelles (Scopus, WoS, EBSCO, PsycINFO, Cairn) et Google Scholar — par l'auteur ou avec ses accès.
3. Réexécution OpenAlex.
4. Confrontation avec les ~64 références existantes du mémoire (dès AF‑01) : doublons, remplacements, compléments.
5. Gel bibliographique à la date convenue (AF‑11).
