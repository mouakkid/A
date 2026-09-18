# Marque : « GARMIN · COMMUNAUTÉ MAROC »

## État actuel

Aucun fichier de logo Garmin dont les conditions d'utilisation ont été vérifiées n'a été fourni. Le site utilise donc une **composition typographique provisoire** (`src/components/brand/brand-block.tsx`) :

- « GARMIN » en Archivo, graisse 900, capitales espacées ;
- « COMMUNAUTÉ MAROC » immédiatement dessous, en accent bleu, lisible à toutes les tailles (y compris `size="sm"` dans le header mobile).

Ce n'est **pas** un logo officiel et il n'est jamais présenté comme tel. La mention communautaire ne doit jamais être réduite à une taille illisible.

## Déclinaisons

| Contexte | Variante | Fichier |
|---|---|---|
| Fond clair | `variant="light"` (texte graphite) | composant |
| Fond sombre (footer, hero) | `variant="dark"` (texte blanc) | composant |
| Automatique selon le thème | `variant="auto"` | composant |
| Favicon / symbole | `CommunityMark` (courbes topographiques + point GPS) | `src/app/icon.svg`, `public/favicon.ico`, `src/app/apple-icon.tsx` |
| Image sociale | Open Graph 1200×630 générée | `src/app/opengraph-image.tsx` |

Zone de protection : la moitié de la hauteur du mot « GARMIN » autour du bloc. Proportion : le sous-titre fait 40 à 45 % de la hauteur du mot principal.

## Remplacer par un logo officiel

1. Obtenir du propriétaire du projet un fichier vectoriel (SVG) et la preuve des conditions d'utilisation (licence, autorisation écrite ou charte d'usage publique).
2. Déposer le fichier dans `public/brand/garmin-logo.svg` (et une version pour fond sombre si nécessaire).
3. Dans `brand-block.tsx`, remplacer le `<span>` « Garmin » par `<Image src="/brand/garmin-logo.svg" alt="Garmin" … />` en conservant la ligne « COMMUNAUTÉ MAROC » directement dessous ou à côté.
4. Conserver la mention « Communauté indépendante — Non affiliée à Garmin » à proximité.
5. Mettre à jour l'image Open Graph.
6. Cocher l'élément correspondant dans `docs/LAUNCH-CHECKLIST.md`.

## Provenance des éléments

- Polices Archivo et Inter : SIL OFL 1.1 (voir `src/fonts/LICENSE-NOTES.md`).
- Symbole communautaire, motif topographique, visuels SVG de substitution : créations originales du projet, libres d'usage dans le projet.
- Aucune photographie n'est utilisée. Tous les emplacements photo sont des visuels SVG marqués « Visuel provisoire » hors production. Les photographies (running, Atlas, trail, cyclisme, littoral marocain) doivent être fournies avec leurs droits avant remplacement.
