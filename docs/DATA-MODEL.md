# Schéma de données

Source de vérité : `src/lib/db/schema.ts` (Drizzle ORM). Migrations SQL générées dans `drizzle/` (`npm run db:generate`), appliquées par `npm run db:migrate` (table de suivi `drizzle.__drizzle_migrations`).

## Tables

| Table | Rôle | Colonnes clés |
|---|---|---|
| `users` | comptes | `email` (unique, insensible à la casse), `username` (unique), `password_hash` (scrypt), `role` (enum), `banned_at`, profil (`display_name`, `bio`, `main_sport`, `devices[]`) |
| `sessions` | sessions serveur | `id` = SHA-256 du jeton cookie, `user_id`, `expires_at`, `user_agent` |
| `devices` | catalogue | `slug` (unique), `model`, `variant`, `family`, `category`, `status` (enum contenu), `spec` (jsonb, schéma `DeviceSpec`), `editorial` (jsonb, `DeviceEditorial`), `official_url`, `last_verified_at` |
| `device_sources` | sources par fiche | `device_id`, `label`, `url`, `accessed_at` |
| `articles` | contenus éditoriaux | `slug` (unique), `type` (news/guide/feature/comparison), `status` (draft/review/published/archived), `body_md`, `byline`, `news_status`, `tags[]`, `device_slugs[]`, `sports[]`, `sources` (jsonb), `tested_by_us`, `published_at`, `significant_updated_at`, `reviewed_by_id`, `reviewed_at` |
| `forum_categories` | catégories | `slug`, `name`, `description`, `position` |
| `forum_topics` | sujets | `category_id`, `author_id`, `slug`, `title`, `body_md`, `status` (published/pending/hidden/deleted), `device_tags[]`, `accepted_reply_id`, `reply_count`, `last_reply_at`, `pinned`, `locked` |
| `forum_replies` | réponses | `topic_id`, `author_id`, `body_md`, `status` |
| `reports` | signalements | `target_type`, `target_id`, `reporter_id`, `reason`, `details`, `status` (open/resolved/dismissed), résolution |
| `moderation_log` | journal | `actor_id`, `action`, `target_type`, `target_id`, `note` |
| `rate_limits` | limitation de débit | `key`, `window_start`, `count` (aucun contenu) |

## Schémas JSON (zod)

- `DeviceSpec` (`src/lib/catalog/types.ts`) : `price`, `dimensionsMm`, `weightG`, `display`, `battery[]`, `gnss`, `maps`, `sensors`, `features`, `waterRating`, `connectivity`, `materials`, `sportProfilesHighlight`, `rawNotes`. Tout champ peut être `null` = « Non vérifié ».
- `DeviceEditorial` : `positioning`, `sports[]`, `profiles[]`, `strengths[]`, `limits[]`, `alternatives[]` (slugs), `guides[]`, `observations[]` (texte + source), `decision` (`tier`, `sizeClass`, `batteryClass`).
- Fichier de seed `data/devices/*.json` : `deviceFileSchema` = métadonnées + `spec` + `editorial` + `sources[]`.

## Workflow éditorial

`draft → review → published → archived` (retours possibles vers `draft`). La publication enregistre `reviewed_by_id` / `reviewed_at`. Le seed n'écrase pas un article déjà relu en base (`reviewed_by_id` non nul).

## Forum : règles de statut

- Premier sujet d'un compte de moins de 24 h → `pending` (visible par l'auteur et la modération).
- Indexation : uniquement `published` avec au moins une réponse (sitemap et `robots` de la page).
