# Garmin.ma — La communauté Garmin au Maroc

Site communautaire **indépendant** consacré aux utilisateurs et futurs utilisateurs des équipements Garmin au Maroc : contenus éditoriaux sourcés, catalogue vérifié, comparateur, assistant de choix explicable, outils GPX/TCX exécutés dans le navigateur, forum d'entraide et back-office éditorial.

> Garmin.ma n'est ni affilié à Garmin, ni agréé ou sponsorisé par Garmin. Le site ne vend pas de produits Garmin. Les marques et logos cités appartiennent à leurs propriétaires respectifs.

## Stack

- **Next.js 16** (App Router, rendu serveur, pages statiques pour les fiches et articles), **React 19**, **TypeScript** strict.
- **Tailwind CSS 4** avec design tokens (graphite, noir, blanc, accent bleu), thème sombre, `prefers-reduced-motion`.
- **PostgreSQL 16** via **Drizzle ORM** ; migrations SQL dans `drizzle/`.
- Authentification maison : sessions en base, cookies `httpOnly`, mots de passe **scrypt** (Node natif), rôles `member / moderator / editor / admin`.
- Outils sportifs : parsing GPX/TCX en **Web Worker** avec `fast-xml-parser` (entités désactivées, DOCTYPE refusé), aucun envoi serveur.
- Tests : **Vitest** (calculs, conversions, moteur de règles, comparateur) et **Playwright** (parcours critiques).

## Installation

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env.local
# Renseigner DATABASE_URL, SESSION_SECRET, SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD

# 3. Base de données
npm run db:migrate      # applique drizzle/*.sql
npm run db:seed         # équipements (data/devices), articles (content/articles), catégories du forum, administrateur

# 4. Développement
npm run dev             # http://localhost:3000

# 5. Production
npm run build && npm run start
```

PostgreSQL local rapide (exemple) :

```bash
createuser garmin -P            # mot de passe : garmin
createdb garmin_ma -O garmin
# DATABASE_URL=postgres://garmin:garmin@127.0.0.1:5432/garmin_ma
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm run start` | Build et serveur de production |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (config Next core-web-vitals + TypeScript) |
| `npm run test` | Tests unitaires Vitest (`tests/unit`) |
| `npm run test:e2e` | Parcours critiques Playwright (`tests/e2e`) contre `npm run start` sur le port 3100 ; `PW_CHROMIUM=/chemin/vers/chrome` pour un Chromium préinstallé |
| `npm run check` | typecheck + lint + tests + build |
| `npm run db:generate` | Génère une migration à partir de `src/lib/db/schema.ts` |
| `npm run db:migrate` | Applique les migrations |
| `npm run db:seed` | Seed idempotent (aucune donnée de démonstration) |
| `npm run db:reset` | Réinitialise le schéma (refusé en production) |

## Variables d'environnement

Voir `.env.example` (sans secret). Résumé :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique (production : `https://garmin.ma`) — canonicals, sitemaps, Open Graph |
| `NEXT_PUBLIC_SITE_ENV` | `production` active l'indexation ; toute autre valeur sert `Disallow: /` et `noindex` |
| `DATABASE_URL` | Connexion PostgreSQL |
| `SESSION_SECRET` | Secret de session (32+ octets) |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Compte administrateur créé par le seed s'il n'existe pas |
| `NEXT_PUBLIC_MAP_TILES_URL`, `NEXT_PUBLIC_MAP_TILES_ATTRIBUTION` | Fournisseur de tuiles pour l'aperçu cartographique optionnel (vide = désactivé) |

## Arborescence

```
src/app/                 routes (accueil, actualites, equipements, comparer, comparatifs, quel-garmin-choisir,
                         guides, fonctionnalites, outils, communaute, admin, pages légales, robots, sitemaps)
src/components/          brand, layout (header, mega-menu, mobile, recherche), catalog, compare, recommend,
                         content, tools, forum, admin, ui, seo
src/lib/db/              schéma Drizzle et client
src/lib/auth/            mots de passe, sessions, rôles, limitation de débit, actions
src/lib/catalog/         types zod (spec constructeur / éditorial), requêtes, comparaison, libellés
src/lib/recommend/       moteur de règles explicable
src/lib/tools/           GPX/TCX (parse/build), analyse, confidentialité, allure, zones FC, stratégie, worker
src/lib/content/         Markdown assaini + sommaire, requêtes articles, front-matter
src/lib/forum/           requêtes, actions, antispam, constantes
src/lib/admin/           actions du back-office
data/devices/            fiches équipements (JSON validé par zod) — sources et dates de vérification
content/articles/        contenus éditoriaux (Markdown + front-matter), statut brouillon/publié
drizzle/                 migrations SQL
tests/unit, tests/e2e    tests ; tests/fixtures : fichiers GPX/TCX synthétiques
docs/                    BRAND, I18N, LAUNCH-CHECKLIST, ROADMAP-V2, EDITORIAL-CALENDAR-90-DAYS, KNOWN-LIMITS,
                         DATA-MODEL, VERIFICATION-RESULTS
```

## Principes éditoriaux et techniques

- Une donnée inconnue s'affiche « Non vérifié » et n'est jamais assimilée à une fonctionnalité absente.
- Données constructeur, observations documentées et avis éditoriaux sont distingués visuellement.
- Prix : devise, marché et date ; aucune conversion en dirhams présentée comme prix local.
- Aucune statistique, témoignage, membre ou discussion inventés. États vides honnêtes.
- Le comparateur dynamique (`/comparer?m=…`) n'est pas indexé ; les comparatifs SEO sont des articles rédigés.
- Les fichiers sportifs ne quittent pas le navigateur ; DOCTYPE/entités XML refusés ; limites 25 Mo / 500 000 points.
- Les environnements de prévisualisation ne sont jamais indexés.

## Rôles

| Rôle | Droits |
|---|---|
| member | forum (sujets, réponses, signalements, réponse acceptée sur ses sujets) |
| moderator | file de modération, masquer/supprimer/verrouiller/épingler, suspendre un compte |
| editor | fiches équipements et articles (workflow brouillon → relecture → publié) + droits modérateur |
| admin | tout, plus attribution des rôles |

Le back-office est accessible sur `/admin` après connexion.

## Documentation

- `docs/BRAND.md` — composition « GARMIN · COMMUNAUTÉ MAROC », déclinaisons, remplacement par un logo autorisé.
- `docs/DATA-MODEL.md` — schéma de données et migrations.
- `docs/VERIFICATION-RESULTS.md` — résultats des vérifications (typage, lint, tests, build, captures).
- `docs/KNOWN-LIMITS.md` — limites connues.
- `docs/LAUNCH-CHECKLIST.md` — checklist de lancement (marque, domaine, infra, SEO, qualité).
- `docs/ROADMAP-V2.md` — roadmap.
- `docs/EDITORIAL-CALENDAR-90-DAYS.md` — calendrier éditorial.
- `docs/I18N.md` — préparation arabe / RTL.

Le dossier `legacy/acode-landing/` contient l'ancienne page d'atterrissage présente dans ce dépôt avant le projet ; elle n'est pas utilisée.
