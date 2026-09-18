---
slug: comprendre-les-zones-de-frequence-cardiaque
type: feature
status: published
title: "Comprendre les zones de fréquence cardiaque : ce qu'elles mesurent, ce qu'elles ne disent pas"
excerpt: "Cinq zones, trois méthodes de calcul, beaucoup d'idées reçues. Comment les zones sont construites, pourquoi deux montres peuvent afficher des zones différentes, et comment les rendre utiles à l'entraînement."
byline: Rédaction Garmin.ma
publishedAt: 2026-09-18
sports: [running, trail, cyclisme, triathlon]
tags: [frequence-cardiaque, zones, entrainement]
sources:
  - { label: "Karvonen, M. J., Kentala, E., Mustala, O. (1957) — The effects of training on heart rate (référence historique de la méthode de la réserve cardiaque)", url: "https://pubmed.ncbi.nlm.nih.gov/13470504/", accessedAt: "2026-09-18" }
  - { label: "Wikipédia — Fréquence cardiaque maximale (synthèse des formules d'estimation et de leurs limites)", url: "https://fr.wikipedia.org/wiki/Fr%C3%A9quence_cardiaque_maximale", accessedAt: "2026-09-18" }
testedByUs: false
---

Les zones de fréquence cardiaque découpent votre effort en paliers d'intensité. Elles sont utiles parce qu'elles sont simples ; elles sont trompeuses parce qu'elles reposent sur des estimations. Voici comment les lire.

## D'où viennent les zones

Une zone est une plage de battements par minute (bpm) définie par un pourcentage d'une valeur de référence. Trois références sont courantes :

| Méthode | Référence | Formule d'une borne |
|---|---|---|
| Pourcentage de la FC max | FC max | FCmax × % |
| Réserve cardiaque (Karvonen) | FC max et FC de repos | FCrepos + (FCmax − FCrepos) × % |
| Pourcentage du seuil (LTHR) | FC au seuil lactique | FCseuil × % |

Le découpage en cinq zones (récupération, endurance, tempo, seuil, VO2 max) est une convention pratique, pas une frontière physiologique nette. Notre outil [Zones de fréquence cardiaque](/outils/zones-frequence-cardiaque) affiche les formules et laisse comparer les trois méthodes.

## Pourquoi votre FC max estimée est probablement fausse

La formule « 220 − âge » décrit une moyenne de population. À âge égal, l'écart individuel atteint couramment plus ou moins 10 à 15 bpm. Une FC max estimée trop basse place toutes vos zones trop bas : vous croyez courir « en zone 4 » alors que vous êtes en zone 3. Une mesure réelle (fin d'un test en côte ou d'une course courte très intense, chez une personne en bonne santé) vaut mieux que n'importe quelle formule.

## Pourquoi deux montres n'affichent pas les mêmes zones

Deux appareils peuvent utiliser des références différentes (FC max, réserve cardiaque, seuil), des pourcentages différents, ou une FC max mise à jour automatiquement sur l'un et pas sur l'autre. Ajoutez la mesure au poignet, sensible au serrage, au froid et aux mouvements du bras, et les écarts deviennent normaux. Les zones affichées par un appareil Garmin dépendent des réglages du profil utilisateur ; nous ne décrivons pas ici l'algorithme du constructeur, que nous n'avons pas vérifié.

## Comment les rendre utiles

- **Choisissez une méthode et gardez-la.** La cohérence dans le temps compte plus que la « bonne » formule.
- **Ancrez-la sur une mesure.** FC max mesurée, ou FC au seuil issue d'un test de terrain.
- **Regardez les tendances, pas la séance isolée.** Chaleur, sommeil, caféine et déshydratation décalent la FC de plusieurs bpm.
- **Complétez par la sensation.** Si la zone 2 vous empêche de parler, quelque chose est mal réglé.

## Ce que les zones ne disent pas

Elles ne mesurent ni la puissance, ni l'allure, ni la fatigue accumulée. Elles ne constituent pas un diagnostic : une FC anormalement haute ou irrégulière au repos relève d'un médecin, pas d'une montre.
