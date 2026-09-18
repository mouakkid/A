---
slug: pourquoi-la-distance-gps-differe-entre-deux-montres
type: guide
status: published
title: "Pourquoi la distance GPS diffère entre deux montres (et entre votre montre et la course)"
excerpt: "200 m d'écart sur un 10 km, un marathon mesuré à 42,6 km : ce n'est pas forcément une panne. Les causes réelles des écarts de distance GPS et ce que vous pouvez y faire."
byline: Rédaction Garmin.ma
publishedAt: 2026-09-18
sports: [running, trail, cyclisme]
tags: [gps, distance, precision]
sources:
  - { label: "GPS.gov — GPS Accuracy (précision du positionnement civil, page officielle du gouvernement américain)", url: "https://www.gps.gov/systems/gps/performance/accuracy/", accessedAt: "2026-09-18" }
testedByUs: false
---

Un fichier GPS est une suite de points horodatés. La distance affichée est la somme des segments entre ces points, parfois lissée, parfois complétée par l'accéléromètre. Chaque étape introduit un écart possible.

## 1. La précision d'un point n'est pas nulle

En conditions dégagées, un récepteur GPS civil place un point à quelques mètres de la position réelle. En ville, sous les arbres, dans une gorge ou près d'une falaise, les signaux rebondissent et l'erreur grandit. Les modes multi-bande (double fréquence) réduisent ces erreurs de réflexion mais ne les annulent pas.

## 2. La fréquence d'enregistrement coupe les virages

Un point par seconde suit fidèlement un virage ; un mode « intelligent » qui espace les points coupe légèrement les courbes et **raccourcit** la distance. Sur un parcours sinueux, l'écart se cumule.

## 3. Le bruit allonge les lignes droites

À l'inverse, à l'arrêt ou à faible vitesse, les points « dansent » autour de la position réelle et **allongent** artificiellement la distance. Les pauses non détectées gonflent un peu le total.

## 4. Vous ne courez pas la ligne officielle

Une course est mesurée sur la trajectoire la plus courte possible. Dépassements, ravitaillements, virages larges : la plupart des coureurs parcourent 0,5 % à 1,5 % de plus que la distance officielle. Un marathon lu à 42,6 km est un résultat normal, pas une erreur de la montre.

## 5. Deux montres, deux algorithmes

Même à côté l'une de l'autre, deux montres n'échantillonnent pas au même instant, ne filtrent pas de la même façon et n'utilisent pas forcément les mêmes constellations. Un écart de 1 % entre deux appareils est courant.

## Ce que vous pouvez faire

- Attendre l'acquisition complète du signal avant de partir.
- Utiliser un mode d'enregistrement à la seconde pour les parcours sinueux.
- Activer le multi-bande en ville ou en montagne si votre modèle le propose (vérifiez sur sa fiche).
- Porter la montre côté extérieur du corps par rapport aux bâtiments.
- Sur piste, se fier au nombre de tours plutôt qu'au GPS.

## Vérifier votre fichier

L'[Inspecteur GPX / TCX](/outils/inspecteur-gpx-tcx) affiche les sauts de position improbables, les pauses et la distance recalculée par la formule de haversine, sans envoyer votre fichier nulle part.
