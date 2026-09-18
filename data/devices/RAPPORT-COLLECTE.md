# Rapport – dataset Garmin (garmin.com fr-FR), vérifié le 2026-09-18

Toutes les valeurs proviennent exclusivement du JSON `GarminAppBootstrap` embarqué dans les fiches produit
officielles `https://www.garmin.com/fr-FR/p/<id>` (onglet « Caractéristiques » + bloc prix du SKU par défaut).
Extraction : `scratchpad/extract.py` (parse du bootstrap + table specs) et `scratchpad/build.py` (mapping vers le schéma).
Aucune valeur n'a été déduite ou complétée de mémoire ; tout ce qui n'est pas écrit sur la fiche est `null`.

## Variantes écrites (26 fichiers dans `devices/`)

| slug | id | source |
|---|---|---|
| forerunner-55 | 741137 | fetch (curl) – « Modèles précédents », prix non affiché (showPrice=false) |
| forerunner-165 | 1055469 | fetch (curl) – « Modèles précédents » |
| forerunner-70 | 1941179 | cache |
| forerunner-170 | 1915560 | cache |
| forerunner-265 | 886785 | cache |
| forerunner-265s | 886689 | cache |
| forerunner-570-42mm | 1463821 | cache |
| forerunner-570-47mm | 1464001 | cache |
| forerunner-970 | 1462801 | cache |
| fenix-8-amoled-47mm | 1228429 | cache |
| fenix-8-solar-51mm | 1390829 | cache |
| fenix-9-47mm | 2021193 | fetch (curl) |
| fenix-9-pro-47mm | 1962732 | fetch (curl) |
| fenix-e-47mm | 1652337 | cache |
| enduro-3 | 851039 | cache |
| instinct-3-amoled-45mm | 1316397 | cache |
| instinct-3-solar-45mm | 1315317 | cache |
| venu-3 | 873008 | fetch (curl) – « Modèles précédents » |
| venu-4-45mm | 1614061 | cache |
| venu-x1 | 1510465 | cache |
| vivoactive-6 | 1555457 | cache |
| edge-550 | 1630737 | cache |
| edge-850 | 1630197 | cache |
| edge-1050 | 1196129 | cache |
| hrm-600 | 1473393 | fetch (curl) |
| varia-rtl515 | 698001 | fetch (curl) |

Pages en cache mais non retenues (hors cible ou doublon de variante) : Forerunner 170 Music (2014513), Venu 4 41 mm (1613801), Instinct 3 50 mm AMOLED (1622337, téléchargée pour vérification).
Listings complémentaires récupérés : `prod_10660.json` (Running – Modèles précédents) et `prod_10668.json` (Forme & Fitness – Modèles précédents) via `https://www.garmin.com/c/api/getProducts?categoryKey=<key>&locale=fr-FR&storeCode=FR`.

## Conventions appliquées

- `price.amount` = **prix catalogue** (`listPrice`) du SKU par défaut ; si une promotion est affichée, le prix promo et l'économie sont reportés verbatim dans `price.note` (ex. Forerunner 265 : 419,99 € catalogue, 349,99 € affiché en promo). Si d'autres SKU du même id ont un prix catalogue différent (fēnix 8 47 mm : versions Sapphire/Titane), c'est signalé dans la note.
- `dimensionsMm` normalisé « a x b x c » (virgules → points) depuis « Taille du boîtier » / « Dimensions physiques » / « Taille du moniteur » ; la ligne complète (tours de poignet, etc.) est conservée dans `rawNotes`.
- `weightG` = premier poids indiqué (SKU par défaut) ; la ligne verbatim est dans `rawNotes` dès qu'elle contient plusieurs valeurs (fēnix 8 47 mm acier/titane, HRM 600 sangle/module, Venu X1 avec/sans bracelet…).
- Booléens : `true` uniquement si la ligne existe avec la coche « Oui » ; **les tables Garmin ne listent jamais les fonctions absentes** (aucune cellule « Non » rencontrée sur les 26 fiches), donc l'absence d'une fonction reste `null`. Deux exceptions justifiées par une mention explicite de la fiche : `features.wifi=false` quand la ligne « Connectivité » énumère « Bluetooth®, ANT+® » sans Wi-Fi (FR 55/70/165/170, Instinct 3), et `display.touchscreen=false` pour l'Edge 550 (sélecteur de version « écran tactile : non »).
- `battery` : chaque ligne d'autonomie de la fiche (résumé « mode montre connectée » + détail), mode/claim verbatim ; les notes de bas de page solaires (*, **) sont dans `rawNotes`.
- `gnss.systems` = constellations cochées dans la section « Capteurs » ; `multiband` d'après « GPS MULTI-BANDES » / « GNSS multibande » ; `satiq` d'après « Technologie SatIQ™ ».
- `maps.preloadedMaps` d'après « Cartes des routes et des sentiers préchargées » (montres) ou « Carte de base » (Edge) ; caveats verbatim conservés (fēnix 8 47 mm AMOLED : « Oui (Éditions Sapphire uniquement) » ; fēnix E : « Oui (téléchargeable) »). `maps.courses` d'après « Guidage pour parcours » (montres) ou « Itinéraires : 100 parcours » (Edge).
- `sensors` = lignes de la section « Capteurs » hors constellations GNSS/SatIQ/GPS 5 Hz.
- `sportProfilesHighlight` = valeurs des lignes Course en extérieur / intérieur, Multisports, Cyclisme, Natation, Plein air (montres) ; pour le HRM 600, liste « Enregistrement d'activité ».
- `model` conserve l'orthographe officielle (fēnix, vívoactive) sans ® / ™ ; `variant` reprend la déclinaison de la fiche (taille, AMOLED/Solar, édition).

## Champs fréquemment indisponibles (null)

- `maps.turnByTurnRouting` : jamais formulé tel quel dans les tables (null sur les 26 fiches).
- `features.ecg`, `flashlight`, `solar`, `speakerMic`, `musicStorage` : null dès que la fiche ne cite pas la fonction (absence non affirmée). `solar` n'est `true` que pour fēnix 8 Solar 51, Enduro 3, Instinct 3 Solar.
- `display.*`, `gnss.*`, `maps.*`, `materials`, `sensors` : null pour HRM 600 et Varia RTL515 (accessoires sans écran / GNSS).
- `display.touchscreen` : null pour Instinct 3 (45 mm AMOLED et Solar) et Forerunner 55 (aucune ligne « Écran tactile »).
- `price` : null pour Forerunner 55 (fiche « Modèles précédents » sans prix affiché, non vendable).
- `materials.bezel` / `case` : souvent null sur les Forerunner d'entrée de gamme et les Edge (non renseignés).
- `variant` : null quand la fiche n'a qu'une déclinaison (FR 55/70/165/170/970, Venu X1, vívoactive 6, Edge 550/1050, Enduro 3, HRM 600, Varia).

## Non trouvés

Voir `devices/not_found.json` : Edge 540, Edge 840 (absents du catalogue fr-FR, remplacés par Edge 550/850), HRM-Pro Plus (non listé ; HRM 600 utilisé), Venu 3S (fiche existante 873214, non extraite volontairement).
