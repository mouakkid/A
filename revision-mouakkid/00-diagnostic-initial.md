# Diagnostic initial — « Travail de mémoire de Anass Mouakkid »

| | |
|---|---|
| **Candidat** | Anass Mouakkid — Production Manager, VARUN BEVERAGES Morocco |
| **Programme** | Global Executive MBA P23 (2024–2026) — Management stratégique, TBS Casablanca |
| **Document audité** | « Travail de memoire de Anass Mouakkid.pdf » — 134 pages, produit en LaTeX (XeLaTeX/xdvipdfmx), créé le 27 mai 2026, clôture analytique le 14 mars 2026 |
| **Sujet** | L'IA comme levier de résilience dans la supply chain FMCG : vers un modèle de pilotage « demand-driven » prédictif |
| **Date du diagnostic** | 7 août 2026 — lecture intégrale des 134 pages, contrôles visuels ciblés (rendus page à page), vérification Crossref de la bibliographie (scripts et réponses brutes archivés dans `verification-biblio/`) |
| **Version** | 1.0 |

---

## 1. Synthèse exécutive

**Statut réel : mémoire complet** — phase empirique réalisée (10 entretiens semi-directifs documentés, INT-01 à INT-10, janvier–mars 2026), résultats, discussion, recommandations, conclusion, annexes A–G et bibliographie présents. Rien n'est à inventer ; tout est à vérifier et à corriger.

**Verdict : NON DÉPOSABLE EN L'ÉTAT — mais corrigeable.** Quatre familles de problèmes bloquants :

1. **Bibliographie partiellement corrompue (M-03).** Sur 43 notices, 6 sont à retirer ou remplacer : 4 introuvables sous la forme citée (Wang & Hajli 2022 ; Adebanjo & Adebanjo 2022 ; Chigwedere et al. 2024 ; Feng et al. 2022), 1 corrompue (Miclo et al. « 2015, PPC » — la référence réelle est 2019, IJPR) et 1 doublon avec auteur erroné (« Ivanov & Dolgui 2023 » = Ivanov 2022, Dolgui n'en est pas auteur). Ces notices portent des affirmations situées à des endroits stratégiques (justification de la lacune de recherche, obstacles data, état de l'art ML). Les trois notices introuvables sont précisément celles qui contiennent des **notes de lecture restées dans la bibliographie** (« Gap académique comblé », « Très citée (45+ citations) », « Cas concrets ») — signature d'une bibliographie annotée générée puis insérée sans vérification.
2. **Contradiction sur les enregistrements (M-01).** Méthodologie : « tous les entretiens ont été enregistrés … intégralement retranscrits » (p. 49 et 50, corpus « de 187 pages de verbatim ») ; Annexe A : « sept ont été enregistrés », les autres sur notes (p. 111). L'un des deux est faux ; la chaîne de preuve des verbatims en dépend.
3. **Attributions de verbatims incohérentes (M-02).** Les étiquettes sous plusieurs citations du chapitre 3 contredisent les tableaux 2.1 et B.1 (INT-05 « Directeur Planification, FMCG Alimentaire » vs Directeur IT multinationale ; INT-04 « Planificateur Demande Senior, PME agroalimentaire » vs Responsable Production, FMCG national ; INT-07 « Société Nationale ETI » vs société nationale agroalimentaire — l'ETI étant INT-06) ; toutes les citations sont datées « mars 2026 » alors que les entretiens s'étalent du 5 janvier au 10 mars.
4. **Incohérence épistémologique (M-04/M-05/M-06).** Le texte affirme que « la démarche ne vise pas à tester des hypothèses préétablies » (p. 43, théorie ancrée, constructivisme) mais le chapitre 3 s'intitule « Test des hypothèses », parle de « validation », « variable modératrice », « médiateur », « corrélée », et le cadre p. 39 est formulé en variables indépendante/dépendante. Le statut ex ante ou émergent de H5–H6 varie selon les chapitres, et la conclusion affirme que les six hypothèses « ont toutes été validées » alors que le tableau 3.1 conclut à des confirmations partielles.

**Classification consolidée : 5 corrections bloquantes, 17 majeures, 9 mineures** (détail : `01-registre-corrections.md`). La correction est réalisable rapidement **si l'auteur fournit les sources LaTeX et les transcriptions** (`02-elements-a-fournir-par-auteur.md`).

## 2. Points forts à préserver

- **Recherche réellement conduite et honnête sur ses limites** : cas de non-confirmation traités en section dédiée (4.4.5 : ruptures aggravées post-implémentation chez INT-02, dérive silencieuse, amplification de biais), limites structurelles du contexte marocain assumées (4.4.6), section limites de la conclusion sincère.
- **Structure complète et professionnelle** : IMRAD adapté, annexes opérationnelles (guide d'entretien à 8 thèmes, tableau synoptique, extrait de codage NVivo avec traçabilité SQ/H, formulaire de consentement, glossaire), signets PDF, hyperliens, figures nombreuses et soignées.
- **Cohérence arithmétique vérifiée** : durées (total 780 min = 13 h, moyenne 78 min exacte), expérience moyenne (13,9 ans exacte), saturation déclarée au 8e entretien cohérente entre §2.2.2, §2.3.2 et annexe C.
- **Concepts originaux à potentiel** : résilience augmentée, forecasting fantôme / adoption symbolique, taxonomie des défaillances algorithmiques, dimension institutionnelle des obstacles — bien reliés aux verbatims.
- **Socle bibliographique majoritairement réel** : 18 articles vérifiés via Crossref (DOI récupérés), plus les classiques (MIT SMR, HBR) et 11 ouvrages de référence authentiques.

## 3. Inventaire des anomalies (résumé — détail au registre)

### 3.1 Bloquantes (intégrité et cohérence de fond)
M-01 enregistrements 10/10 vs 7/10 ; M-02 attributions et dates des verbatims ; M-03 six notices bibliographiques corrompues/inexistantes + réancrage des passages appuyés dessus ; M-04 vocabulaire hypothético-quantitatif incompatible avec le design qualitatif annoncé ; M-05 statut ex ante/émergent de H5–H6 raconté différemment en introduction (émergent du terrain), chapitre 1 (déduites de la littérature) et §4.5 (les apports « non anticipés » sont d'autres éléments).

### 3.2 Majeures
M-06 « toutes validées » vs verdicts partiels ; M-07 figure 3.3 sans badge de verdict pour H5–H6 (contrôle visuel) ; M-08 tableau 4.2 réutilisant les codes H1–H4 avec des intitulés qui ne correspondent plus aux hypothèses ; M-09 « dix répondants, tous issus du secteur FMCG » (p. 80) vs 3/10 hors FMCG ; M-10 chiffres du pipeline de codage incohérents (« plusieurs centaines » vs 127 codes ; 8 vs 10 catégories) ; M-11 figure 2.1 (« consultants » inexistants dans l'échantillon ; « constructivisme pragmatique » vs « constructiviste ») ; M-12 promesse d'anonymat vs quasi-identifiants publiés et remerciements nommant l'employeur-terrain et ses dirigeants ; M-13 « vide régulatoire » à dater et nuancer (loi 09-08 existante ; initiatives IA marocaines 2024–2026) et « conformité RGPD » à re-référencer ; M-14 statistiques non sourcées (4–6 % du PIB industriel ; 40–60 % de distribution informelle) et rapports cités absents de la bibliographie (Banque mondiale 2024, UNCTAD 2024, Gartner/McKinsey/Forrester p. 92) ; M-15 correspondances citation-idée à revérifier (Makridakis 2018 ; Sodhi 2012 « méta-analyse » ; Wamba 2015) ; M-16 citations « and » dans le texte français et doublons « (2004)(Christopher and Peck, 2004) » ; M-17 double système de citation (notes de bas de page + auteur-date) ; M-18 guillemets rendus « ń … ż » dans tout le PDF (bug de police, contrôle visuel pp. 43, 66) ; M-19 bibliographie sans aucun DOI, notes de lecture à retirer, écarts de pages/années ; M-20 absence de mention du cadre marocain de protection des données (loi 09-08/CNDP) pour une collecte d'entretiens enregistrés ; M-21 incohérences internes du dispositif éthique (formulaire prévoyant l'enregistrement systématique vs 7/10 ; « anonymisation » pour une pseudonymisation).

### 3.3 Mineures (forme)
M-22 légendes de tableaux hétérogènes (« TABLE 1.1 – Tableau 1.1 — », légende-source sans titre au 4.2, collision « Tableau 4.1 » texte vs flottant TABLE 4.2, matrice de maturité p. 85 sans numéro) ; M-23 absence de liste des tableaux ; M-24 métadonnées PDF vides (titre, auteur, sujet, mots-clés) ; M-25 échelle de maturité 3 catégories vs 5 points non définis ; M-26 « trois résultats contre-intuitifs » annonçant six sous-sections ; M-27 dimensions de la figure 4.3 différentes de celles de la matrice p. 85 ; M-28 ponctuation française dans l'abstract anglais (« : » espacé) ; M-29 en-tête « Conclusion Générale » sur la page de transition des annexes ; M-30 verbatim « L'IA décide, l'humain valide » (annexe C) sémantiquement inversé par rapport au modèle défendu — à vérifier sur transcription.

## 4. Niveau d'assurance du présent diagnostic

- Lecture intégrale du texte extrait (100 % des 134 pages), contrôles visuels par rendu d'image des pages 29, 43, 66, 85, 109 (les fusions « défi+mot » de l'extraction se sont révélées être des artefacts — le PDF imprime correctement ; les guillemets « ń…ż » et l'absence de badges H5–H6 sont en revanche confirmés visuellement).
- Vérification bibliographique : 30 articles contrôlés via l'API Crossref (2 passes, requêtes et réponses brutes archivées dans `verification-biblio/raw/`), 13 ouvrages/rapports/actes listés pour contrôle hors Crossref. Aucun verdict n'est déclaré sans réponse API archivée.
- Ce diagnostic ne remplace ni un contrôle de similitude institutionnel, ni la vérification des verbatims sur les transcriptions (accès requis, AF-M-02), ni l'expertise juridique CNDP.

## 5. Trajectoire de correction proposée

1. **Fournitures de l'auteur** (AF-M-01 à 07) — en tête : sources LaTeX + transcriptions.
2. **Passe d'intégrité** : bibliographie (retraits/remplacements/réancrages, DOIs, notes de lecture), enregistrements 7 vs 10, attributions des verbatims — sur pièces.
3. **Passe de cohérence** : requalification du vocabulaire (hypothèses → propositions explorées ; « soutenue/nuancée/non soutenue dans ce corpus » ; modération/médiation → associations et conditions perçues), harmonisation des chiffres de codage, statut de H5–H6, figures 2.1/3.3/4.3, tableau 4.2.
4. **Passe éthique** : pseudonymisation (terme et granularité du tableau des répondants), remerciements vs confidentialité, mention loi 09-08/CNDP, formulaire.
5. **Passe éditoriale** : guillemets (source LaTeX), citations FR, système unique auteur-date, légendes normalisées, liste des tableaux, métadonnées PDF, APA 7 complet avec DOIs.
6. **Bon à tirer** : recompilation, contrôle visuel page à page, registre final, déclaration de conformité conditionnelle.
