# garmin.com (fr-FR) — analyse UX/UI de référence

Source : HTML/CSS/JS en cache (accueil, catégories, fiches produit, bundles produit/catégorie/comparateur) et quelques modules CSS/JS récupérés en direct. But : comprendre les mécanismes, pas les reproduire.

## 1. Navigation

- **Sandwich noir/blanc/noir** : bandeau promo noir (livraison offerte, `.8rem`) → header blanc (logo SVG 18 px) → footer noir.
- **8 entrées** (Oswald majuscules, barre 40 px centrée ≥ 1024 px, hamburger en dessous) : Montres connectées · Sport et fitness · Activités outdoor · Auto & maison · Marine · Aviation (anglais) · Promotions · Support.
- **Méga-menu à colonnes fixes** : Produits / Cartes / Accessoires et abonnements / Découvrir (+ Communautés pour Sport et Outdoor). Sous Sport et fitness, classement **par pratique** (Running, Marathon, Multisports, Aventure, Natation, Plongée, Golf, Jeunesse, Cycle…) ; « Découvrir » pousse Technologie Garmin, Trouver sa montre, Garmin Coach. Chaque panneau contient 1–2 promo-cards (image, titre, CTA).
- **Sticky** : header `position:relative` (non collant). Seule la fiche produit a une sous-nav `sticky` ≥ 768 px (fond `#e5e5e5`, liens majuscules, soulignement actif 4 px noir), un « Ajouter au panier » fixé en bas sur mobile et un retour en haut.
- **Footer** : 4 accordéons (Service client, Société, Plateformes, Entreprises), pays, réseaux, légal.

## 2. Hiérarchie de l'accueil

Ordre des modules (JSON Contentful embarqué) :
1. **Hero rotator** : 8 bannières plein écran, autoplay 6 s avec anneau de progression, flèches au survol seulement, texte blanc à gauche sur 1/3–1/4 de largeur, sans dégradé.
2. **« Nouveautés »** : carrousel de 11 cartes (packshot, titre Oswald centré, copy `.9rem`, légal `.6875rem`), dont un quiz « Trouvez la montre idéale ».
3. 3 cartes (1/3) à CTA bordé ; 4. 2 tuiles (1/2) photo + dégradé noir bas ; 5. spacer 64 px puis « Filtrer par catégorie » : 6 tuiles photo lifestyle + dégradé + titre majuscule + bouton fantôme « Acheter » ; 6. newsletter.

- **Typo** : titres `Oswald` 400, `letter-spacing:.05rem`, h1 2 → 2,5 rem, h2 1,5 → 2 rem (≥ 768 px) ; corps `Roboto` 400, 16 px / 1,5. Boutons : Roboto 500 majuscules, `border-radius:0`, `padding:1rem 2rem`, bord 1 px, inversion noir/blanc au survol.
- **Palette** : aucune variable de couleur ; monochrome `#000`/`#fff` + gris (`#333`, `#4d4d4d`, `#7a7a7a`, `#e5e5e5`, `#f6f6f6`, `#d8d8d8`). Accents rares : bleu `#106fad` (liens de tableaux, prix soldé), « candy blue » `#6dcff6`, badges `#c20f2f`/`#f7607b`/`#f0b800`/`#cad54f`, orange `#ff9b00` (panier accessoires).
- **Tokens** : breakpoints 480/768/1024/1200/1350/1440/1824 ; espacements `.25 → 5rem` ; cartes `margin:1rem`, tuiles `.5rem`.
- **Images** : photos `object-fit:cover` + dégradé 60–75 %, packshots sur blanc.

## 3. Présentation des produits

- **Catégorie (Running)** : fil d'Ariane → bloc gris h1 + slider de **3 cartes de niveau** (Débutant / Avancé / Elite, photo + phrase + lien vers la grille filtrée) → grille (« Filtrer et trier par », tri Popularité/Nom/Prix, 18 par page, produits regroupés par famille) → newsletter → notes légales. Carte = packshot, nom, description courte, badge « kicker » (Oswald majuscule, fond coloré, coupe oblique). Cartes pub insérées dans la grille. Bouton « COMPARER » (2 produits max).
- **Fiche produit (fēnix 8)** : nom (Oswald), variante, référence, prix 1,5 rem (barré + « Remise »), pastilles couleur, sélecteurs taille/version = liens vers d'autres fiches, bouton personnalisation. **5 onglets** (Vue d'ensemble, Cartographie, Dans la boîte, Accessoires, Caractéristiques) → **accordéons +/−** sur mobile. Vue d'ensemble : 7 blocs `pc-life-style` plein écran à claims majuscules, vidéo, intro à 6 icônes, galerie Instagram, puis **120 mini-cartes** en grilles de 5 colonnes groupées par thèmes (Performances, Activités, Navigation, Santé, Connecté). Caractéristiques : 21 **tableaux thématiques** (« Vous allez adorer », Général, Capteurs, Cartographie…), 364 lignes libellé / valeur ou coche, libellés liés aux pages « Technologie Garmin ». Colonne : manuels, logiciel, FAQ ; cross-sell et upsell avec CTA « Comparer ».
- **Comparateur** : cartes produit (image, titre, prix, achat), carte « ajouter » à autocomplétion, 2 à 5 colonnes selon largeur (≤ 609 px → 2, ≥ 1020 px → 5), menu collant au défilement, case **« uniquement les différences »** filtrant les groupes de specs.

## 4. L'impression « premium, sportif, technologique »

**À capter (principes)** : contraste monochrome strict ; titres condensés courts en majuscules ; photo lifestyle plein cadre + packshot sur blanc ; boutons carrés fantômes ; densité fonctionnelle organisée par thèmes avec libellés explicatifs cliquables ; entrée par pratique/niveau plutôt que par gamme ; comparateur limité avec « différences seulement ».

**À ne pas copier** : couple Oswald + Roboto, sandwich noir/blanc/noir, rotator à anneau de progression, tuiles « dégradé noir + Acheter », badges à coupe oblique, claims marketing, ordre et intitulés des tableaux de specs, packshots `res.garmin.com`, galerie @garmin, classes `g__*`/`pc-*`. Pistes : autre paire typographique (grotesque géométrique + humaniste), accent inspiré d'un terrain, mode sombre natif, coins arrondis ou grille asymétrique, hiérarchie centrée sur l'usage communautaire (guides, outils, retours) plutôt que l'achat.

## 5. Non accessible / non vérifiable

- `support.garmin.com` bloqué ; rendu réel non vu (Vue côté client, aucune capture de garmin.com — `shots/` concerne le site communautaire).
- CSS des cartes de la grille catégorie dans des chunks lazy (`app20–23`) non en cache ; survols et animations non testés.
- Traductions du comparateur chargées par API (clés seules visibles) ; quiz, configurateur, panier, compte, Garmin Connect non inspectés ; Aviation en anglais uniquement.
