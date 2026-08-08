# Diagnostic v2 — revérification sur pièces du mémoire EL HASSOUNY

**Version :** 2.0 — 7 août 2026 · Le fichier source natif a été fourni (`Memoire_GEMBA_ELHASSOUNY_depot_1.docx`, 743 paragraphes, 15 tableaux, 125 titres, 8 figures). Il est archivé dans `manuscrit/memoire_source_depose.docx` ; la conversion de travail est `manuscrit/manuscrit-original.md` (copie corrigée : `manuscrit-corrige.md`). **Le bloquant N01 est levé.**

## 1. Statut du document — confirmé

Protocole théorico-méthodologique complet (Parties I et II + annexes A à E + bibliographie avec DOI), sans phase empirique : la conclusion l'énonce elle-même (« avant tout contact avec le terrain » ; collecte « planifiée sur trois à quatre mois, entre l'été et l'automne 2026 » ; contributions « conditionnelles »). Le verdict de l'audit (B1) est vérifié mot pour mot. Les métadonnées du fichier confirment A21 (auteur = « python-docx », titre vide).

## 2. Anomalies de l'audit vérifiées sur pièces

| Réf. | Constat de l'audit | Vérification sur le fichier source |
|---|---|---|
| A02 | Statut du pilote contradictoire | **Confirmé** : §4.2.5 décrit le test au présent de protocole ; la conclusion liste « guide semi-directif soumis à un pré-test » parmi les acquis, puis place « le pré-test du guide » dans le calendrier futur ; l'annexe A annonce que « la version définitive intégrera, le cas échéant, les ajustements issus du test pilote » |
| A03 | CNDP éventuelle | **Confirmé** : « Si la nature du traitement le justifie, une déclaration préalable à la CNDP est effectuée » (§4.3.3) |
| A07 | Collision TRA | **Confirmé** : TRA = Theory of Reasoned Action (chap. 2) et famille de codes « TRA (transparence et confiance) », codes TRA-1/2/3 (grille, annexes) |
| A09 | Causalités et modérations | **Confirmé** : question principale « Quels facteurs influencent… » (3 occurrences identiques : introduction, ouverture de la Partie I, annexe A) ; « architecture causale en cinq blocs » ; « influencent positivement » ; « modulent les liens causaux » ; « validée, invalidée » (§2.5.2) |
| A11 | Accès aux enregistrements | **Confirmé** : « accès limité au chercheur et, pour supervision, à l'encadrante » (§4.3.2) vs « seul chercheur » (annexes B et C) |
| A12 | Cloud vs « aucun transit tiers » | **Confirmé** : enregistrement « par la fonctionnalité intégrée en visioconférence » (Teams/Zoom/Meet) vs « de manière à ce qu'aucun enregistrement ne transite par un service tiers » (§4.3.2) |
| A13 | Anonymisation vs pseudonymisation | **Confirmé** : « retranscription intégrale et anonymisée », codes R1 à Rn, entreprises E1, E2…, recontact prévu (member checking) : dispositif de pseudonymisation |
| A16 | APA 7, « et al. » | **Confirmé et massif** : « Williams, Rana et Dwivedi » (6 occurrences), « Guest, Bunce & Johnson », « Tambe, Cappelli & Yakubovich », « Mayer, Davis & Schoorman », « Dietvorst, Simmons & Massey », « Logg, Minson & Moore », « Venkatesh, Thong & Xu », « Miles, Huberman & Saldaña »… |
| A05 | Stratégie documentaire non reproductible | **Confirmé avec nuance** : un paragraphe « Le corpus mobilisé et le statut des sources » (ouverture de la Partie I) documente bases (Semantic Scholar, Scopus, IMIST, Toubkal) et trois critères d'inclusion ; manquent les dates d'interrogation, les chaînes de recherche, les nombres de résultats et la procédure de sélection. Le protocole `03-…` comble exactement ce manque |
| A01, B5 | Partie III absente, contributions « attendues » | **Confirmé** (« Ce que la phase empirique devra trancher », « contributions attendues… conditionnelles ») |

Les autres items (A06 littérature, A10 échantillonnage, A14 kappa, A15 sources primaires, A17 tableaux fractionnés, A18–A28 forme) seront vérifiés chapitre par chapitre au fil des corrections ; rien de ce qui a été lu ne les contredit.

## 3. Anomalies nouvelles détectées sur pièces

| Réf. | Constat | Gravité |
|---|---|---|
| N07 | La question principale est « désignée F2 dans la suite du document », F2 étant défini dans la liste des abréviations comme « deuxième formulation, retenue, de la question principale » : artefact de cuisine rédactionnelle exposant le versionnage interne | Mineure — **corrigée** (étiquette et entrée d'abréviation retirées dans `manuscrit-corrige.md`) |
| N08 | Double nomenclature des variables de P6 : le Tableau 6 les code CONF, TRANSP, RISK-ETH, CONF-DATA, tandis que la grille de codage utilise la famille TRA (TRA-1 confiance, TRA-2 explicabilité, TRA-3 fiabilité) et des familles distinctes pour risques et confidentialité : la chaîne variable → code n'est pas univoque | Majeure — à résoudre avec A07 (renommage CT) au chapitre 2 et dans les annexes |
| N09 | Vocabulaire des verdicts incohérent : « soutenir, la nuancer ou la contredire » (introduction) et « soutenue, nuancée ou contredite » (conclusion) coexistent avec « validée, invalidée » (§2.5.2) | Majeure — unifier sur « soutenue / nuancée / non soutenue dans ce corpus » |
| N10 | La question principale est citée en trois endroits (introduction, Partie I, annexe A) : toute reformulation doit être propagée aux trois occurrences, sous peine de désynchronisation | Point de méthode — **traité** : la reformulation a été appliquée aux trois occurrences d'un coup |

## 4. Premières corrections appliquées (manuscrit-corrige.md)

1. **Question principale reformulée** en termes d'association, aux trois occurrences : « Quels facteurs sont associés, dans le discours des professionnels des ressources humaines de la région Souss-Massa (Maroc), à l'adoption, à la non-adoption ou à l'usage différencié de l'intelligence artificielle… » (A09, mission §2).
2. **Étiquette F2 retirée** (texte + liste des abréviations) (N07).
3. **Objectif général et OS1 à OS5 insérés** entre les sous-questions et les propositions, avec renvois SQ ↔ P et clause explicite de non-modification de la portée (audit §4.1, mission §2, règle 9).
4. **Sous-questions dé-causalisées** : SQ2 (« quelle place lui accordent-ils »), SQ4 (« sont décrites comme favorisant ou freinant »), SQ5 (« anxiété liée à l'usage » et « sont rapportés comme pesant »), SQ6 (« interviennent-elles dans »).
5. **Propositions P1 à P6 reformulées** en associations/perceptions ; P5 distingue désormais l'anxiété d'usage de la crainte du remplacement (préparation d'A08) ; P6 annonce sa décomposition en P6a à P6d (préparation d'A09/AF-07).

Ces reformulations seront propagées au chapitre 2 (§2.5, Tableau 6), au chapitre 4 et aux annexes lors des passes suivantes, avec mise à jour de la matrice de traçabilité (`04-…`).

## 5. Prochaines passes (ordre de travail)

1. **Chapitre 2 / cadre conceptuel** : renommage TRA → CT propagé (A07, N08), séparation AX/RMP (A08), décomposition effective P6a-P6d, requalification de l'« architecture causale » en architecture de lecture non causale, verdicts unifiés (N09), Tableau 6 aligné.
2. **Chapitres 3–4 / méthodologie** : critères obligatoires vs souhaitables et plan prévisionnel (A10 ; intégration de la cible de 14 répondants comme plan étiqueté, voie b de N02), pilote au futur partout (A02), kappa spécifié (A14), stratégie documentaire complétée (A05).
3. **Éthique** : CNDP en préalable ferme (A03), liste unique des destinataires (A11), variante d'enregistrement arbitrée (A12), pseudonymisation (A13), durées par catégorie, second codeur destinataire.
4. **Transversal** : « et al. » APA 7 (A16), terminologie (A28), abréviations (A19), notes de source (A20), puis reconstruction DOCX/PDF avec mise en page (A17, A21, A22) et contrôle visuel page à page.
