# Registre des références et DOI vérifiés — mémoire EL HASSOUNY

**Version :** 1.0 — 8 août 2026 · Livrable n° 5 de la mission. Contrôle indépendant, postérieur à celui de l'audit, exécuté sur la bibliographie de la version corrigée (`manuscrit/manuscrit-corrige.md`). Preuves : `verification-biblio-memoire/dois_verifies.json` (réponses Crossref) et script rejouable `verify_dois.py`.

## 1. Résultat global

| Contrôle | Résultat |
|---|---|
| Notices bibliographiques | **67** (65 académiques + 2 sources institutionnelles et législatives marocaines) |
| Notices portant un DOI | **51** — chacune résolue via l'API Crossref le 08/08/2026 |
| Écarts détectés (auteur ou année) | **0** |
| DOI non résolus | **0** (l'audit en avait 2 en échec technique ; les deux se résolvent désormais) |
| Notices sans DOI | **16** : 14 ouvrages et chapitres classiques authentiques (Bardin ; Bhaskar ; Creswell & Poth ; Fishbein & Ajzen ; Glaser & Strauss ; Guba & Lincoln ; Le Moigne ; Lincoln & Guba ; Miles et al. ; Paillé & Mucchielli ; Patton ; Popper ; Rogers ; Thiétart) et 2 sources marocaines (loi 09-08 ; stratégie *Maroc Digital 2030*) |
| Citations du corps sans entrée bibliographique | **0** |
| Entrées non appelées dans le corps | **1 cas limite** : la notice du Ministère (2024, *Maroc Digital 2030*) est mobilisée par le nom de la stratégie, sans appel auteur-année ; ajouter un appel explicite « (Ministère délégué chargé de la Transition Numérique et de la Réforme de l'Administration, 2024) » à la première mention |

## 2. Portée et limites du contrôle

- La vérification atteste **l'existence et la concordance des métadonnées** (DOI → premier auteur, année) ; elle ne valide pas à elle seule la fidélité de chaque idée attribuée à chaque source. Trois correspondances citation-idée restent à confirmer par lecture ciblée avant dépôt : les cas d'entreprise (Amazon, HireVue, Workday), déjà requalifiés par le mémoire lui-même en illustrations à faible portée probante ; les affirmations contextuelles marocaines appuyées sur les deux sources institutionnelles ; et les données de cadrage chiffrées éventuelles.
- Les 2 sources marocaines sans DOI doivent porter leur URL officielle et leur date de consultation dans la version de dépôt (correction A15/A16 restante, signalée dans la déclaration finale).
- L'actualisation 2023–2026 du corpus reste à intégrer après lecture : **39 références candidates, toutes vérifiées via Crossref (0 échec)**, sont consignées dans `09-registre-references-verifiees.md` avec leur provenance (`08-journal-recherche-documentaire.md`). Conformément à la règle de non-citation sans lecture, aucune n'a été insérée dans le texte.

## 3. Chaîne de preuve

1. Bibliographie extraite de la version corrigée (section « Bibliographie », 67 notices).
2. 51 DOI résolus un à un via `api.crossref.org/works/{doi}` ; verdicts et titres Crossref archivés dans `dois_verifies.json`.
3. Réconciliation citations ↔ bibliographie dans les deux sens par balayage automatisé du corps du texte (auteur + année), complétée d'un contrôle manuel des cas limites.
4. Aucune référence n'a été créée, complétée ou supposée au cours de la révision ; aucune n'a été retirée.
