# Résultats des vérifications — 18 septembre 2026

Environnement : conteneur Linux, Node 22, PostgreSQL 16 local, Chromium préinstallé (Playwright). Build de production `next build` + `next start` sur le port 3100.

## Qualité du code

| Vérification | Commande | Résultat |
|---|---|---|
| Typage | `npm run typecheck` | 0 erreur |
| Lint | `npm run lint` | 0 erreur, 0 avertissement |
| Tests unitaires | `npm run test` | 6 fichiers, 41 tests, tous passés (allure, zones FC, stratégie, GPX/TCX parse/build, conversions avec rapport de pertes, confidentialité GPS, sécurité XML, comparateur, moteur de recommandation) |
| Build | `npm run build` | succès ; toutes les routes en rendu serveur dynamique sauf robots/sitemap/icônes/OG |
| Parcours critiques | `npm run test:e2e` | 14/14 passés (desktop Chrome + Pixel 7) : accueil, catalogue → fiche → comparateur, assistant 9 questions, outil allure, inspecteur GPX (fichier valide + fichier XXE refusé), inscription → sujet de forum (en attente de relecture pour compte neuf), 404 réelle |

## Données

- 26 fiches équipements publiées, toutes lues sur `garmin.com/fr-FR/p/<id>` le 18/09/2026 (rapport de collecte : `data/devices/RAPPORT-COLLECTE.md`, non trouvés : `data/devices/_non-trouves.json`).
- Validation zod de chaque fichier au seed : 26/26 valides.
- 8 articles publiés (5 guides, 3 fonctionnalités expliquées), 1 brouillon d'actualité non visible.
- 9 catégories de forum, 0 discussion (aucune donnée de démonstration).

## Accessibilité (axe-core 4.13, WCAG 2.x A/AA + bonnes pratiques)

`PW_CHROMIUM=/opt/pw-browsers/chromium node scripts/a11y-check.mjs` — 13 pages × 2 largeurs (1440 px et 390 px) : **0 violation** après corrections (ordre des titres sur les listes, contraste des textes secondaires et du vert « Oui », zone de dépôt de fichier sans contrôles imbriqués et avec libellé, nom accessible du bloc de marque).

Vérifications manuelles réalisées via Playwright : ouverture de la recherche au clavier (`/`), navigation du tiroir mobile, focus visible. Non réalisé : test avec lecteur d'écran.

## Performance (Lighthouse 13.4, mobile simulé « slow 4G », build de production)

| Page | Perf | FCP | LCP (simulé) | CLS | TBT |
|---|---|---|---|---|---|
| Accueil | 96 | 0,9 s | 2,8 s | 0 | 40 ms |
| Guide (article) | 96 | 0,9 s | 2,8 s | 0 | 50 ms |
| Équipements | 94–96 | 0,9 s | 2,8–3,0 s | 0 | 30–70 ms |
| Inspecteur GPX | 94 | 0,9 s | 3,2 s | 0 | 50 ms |

- LCP observé (non simulé) sur l'accueil : ≈ 0,4 s (TTFB 267 ms + rendu 127 ms). La valeur simulée reste au-dessus de 2,5 s sous le profil « slow 4G » de Lighthouse ; **la cible de 2,5 s est une cible terrain (p75) à mesurer avec du trafic réel**, non atteignable en laboratoire ici.
- Optimisations appliquées : polices sous-ensemblées et instanciées (385 Ko → 133 Ko, Latin étendu chargé à la demande via `unicode-range`), aucune animation d'opacité sur l'élément LCP, révélation au défilement conditionnée à la présence de JS, CSS critique inline par Next, aucune image raster.
- Score SEO Lighthouse = 66 sur cet environnement **par construction** : `NEXT_PUBLIC_SITE_ENV=development` sert `noindex` et `Disallow: /`. En production (`production`), l'indexation est activée.
- Poids total accueil : 288 Ko.

## SEO technique

- Titres et descriptions uniques par page ; canonicals ; `metadataBase` = `NEXT_PUBLIC_SITE_URL`.
- `robots.txt` conditionnel ; `sitemap.xml` (index) + `sitemaps/pages|equipements|articles|forum.xml` ; le forum n'expose que les sujets publiés avec au moins une réponse.
- JSON-LD : Organization (éditeur indépendant), WebSite (SearchAction), BreadcrumbList, Article/NewsArticle/TechArticle.
- Comparaisons dynamiques `/comparer?m=…` en `noindex, follow`.
- Redirections durables dans `next.config.ts` ; page 404 réelle (statut HTTP 404 vérifié).

## Captures

`docs/captures/` : accueil (desktop, mobile), fiche Forerunner 265 (desktop, mobile), comparateur 3 modèles (desktop, mobile), résultat de l'assistant, outil allure (mobile), inspecteur GPX (desktop), communauté (mobile).

## Non vérifié / hors périmètre de cet environnement

- Mesures terrain (CrUX/RUM) ; Search Console ; propriété du domaine ; autorisation d'usage de la marque ; envoi d'e-mails.
- Serveur `next dev` : hydratation impossible dans cet environnement (WebSocket HMR bloqué par le proxy) — sans effet sur la production.
