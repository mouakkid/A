# Checklist de lancement — garmin.ma

Aucun élément ci-dessous n'a été réalisé sans preuve. Cocher uniquement avec la référence (document, capture, ticket).

## Juridique et marque
- [ ] Vérifier la propriété du domaine garmin.ma et l'accès au registrar.
- [ ] Vérifier l'usage de la marque Garmin (nom de domaine, mention « Garmin » dans la marque du site) auprès d'un conseil ; conserver la preuve. L'ajout de « Communauté » ne vaut pas autorisation.
- [ ] Obtenir un fichier de logo avec conditions d'utilisation vérifiées, ou conserver la composition typographique (voir docs/BRAND.md).
- [ ] Relire les pages À propos, Confidentialité, Conditions d'utilisation, Règles communautaires avec la personne responsable.
- [ ] Renseigner l'identité de l'éditeur (personne ou structure) sur la page À propos si la loi l'exige.

## Infrastructure
- [ ] PostgreSQL de production provisionné ; `DATABASE_URL` en secret.
- [ ] `SESSION_SECRET` aléatoire (32+ octets) en secret.
- [ ] `NEXT_PUBLIC_SITE_URL=https://garmin.ma` et `NEXT_PUBLIC_SITE_ENV=production` sur l'environnement de production uniquement.
- [ ] Environnements de prévisualisation avec `NEXT_PUBLIC_SITE_ENV=preview` (robots Disallow + noindex automatiques).
- [ ] `npm run db:migrate` puis `npm run db:seed` exécutés en production ; compte administrateur créé puis mot de passe changé.
- [ ] HTTPS, redirection www → apex (ou l'inverse) décidée et configurée.
- [ ] Sauvegardes de base de données planifiées et test de restauration effectué.
- [ ] Journalisation sans contenu de fichiers sportifs ; vérifier la configuration du reverse proxy.

## Contenu
- [ ] Chaque fiche publiée a des sources datées et une date de vérification récente (< 90 jours).
- [ ] Prix : devise, marché et date présents ; aucune conversion MAD affichée comme prix local.
- [ ] Articles publiés relus par une personne différente de l'auteur (journal de modération).
- [ ] Photographies avec droits fournies, ou visuels provisoires assumés (le libellé « Visuel provisoire » disparaît en production : décider si c'est acceptable).

## SEO et mesure
- [ ] Vérifier `/robots.txt` et `/sitemap.xml` en production.
- [ ] Google Search Console : propriété ajoutée et sitemap soumis (nécessite l'accès au domaine ; non réalisé).
- [ ] Mesure d'audience respectueuse de la vie privée choisie, documentée dans la page Confidentialité avant activation (non réalisé).
- [ ] Données structurées validées (Organization, WebSite, BreadcrumbList, Article).

## Qualité
- [ ] `npm run check` vert (typage, lint, tests unitaires, build).
- [ ] Tests de parcours critiques (`npm run test:e2e`) verts contre une base de test.
- [ ] Audit Lighthouse mobile sur accueil, fiche, comparateur, un outil ; corriger tout CLS > 0,1.
- [ ] Vérification clavier complète : mega-menu, tiroir mobile, recherche, comparateur, assistant, formulaires.
- [ ] Vérification `prefers-reduced-motion` et contraste (WCAG 2.2 AA).
- [ ] Mesure terrain (CrUX / RUM) programmée après ouverture du trafic : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 au 75e percentile.

## Communauté
- [ ] Au moins deux modérateurs nommés ; rôles attribués dans le back-office.
- [ ] Procédure de traitement des signalements et des demandes de suppression de compte écrite.
- [ ] Service d'envoi d'e-mails configuré avant d'activer réinitialisation de mot de passe et formulaire de contact.
