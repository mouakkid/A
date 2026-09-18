---
slug: importer-un-itineraire-gpx-sur-sa-montre
type: guide
status: published
title: "Importer un itinéraire GPX sur sa montre : trace, parcours ou activité ?"
excerpt: "Un GPX peut contenir une trace, un itinéraire ou une activité passée. Comprendre la différence évite la plupart des échecs d'import et des parcours sans guidage."
byline: Rédaction Garmin.ma
publishedAt: 2026-09-18
sports: [trail, randonnee, cyclisme, running]
tags: [gpx, parcours, navigation]
sources:
  - { label: "Spécification GPX 1.1 (Topografix) — éléments trk, rte, wpt", url: "https://www.topografix.com/GPX/1/1/", accessedAt: "2026-09-18" }
testedByUs: false
---

## Trois objets différents dans un même format

Le format GPX distingue :

- **la trace (`<trk>`)** : une suite de points enregistrés, souvent horodatés. C'est ce qu'exporte une activité passée ;
- **l'itinéraire (`<rte>`)** : une suite de points de passage à relier, sans horodatage ;
- **les waypoints (`<wpt>`)** : des points isolés (sommet, source, ravitaillement).

La plupart des outils de création de parcours exportent une trace dense, parfois accompagnée de waypoints. Les fichiers TCX, eux, distinguent explicitement une **activité** (Activity) d'un **parcours** (Course).

## Le chemin habituel

1. Créez ou téléchargez le parcours (application de cartographie, fichier partagé sur le forum).
2. Importez-le dans Garmin Connect (site web ou application), rubrique parcours.
3. Envoyez-le vers la montre depuis Garmin Connect, puis synchronisez.
4. Sur la montre, ouvrez le profil d'activité, puis la navigation, et choisissez le parcours.

Les écrans exacts dépendent du modèle. Toutes les montres n'offrent pas les mêmes fonctions de navigation : certaines suivent une trace sans fond de carte, d'autres affichent une carte et un guidage virage par virage. Vérifiez la ligne « Cartes préchargées » et « Guidage virage par virage » sur la fiche de votre modèle ; si elle indique « Non vérifié », nous n'avons pas trouvé l'information et vous devez la confirmer dans le manuel.

## Les erreurs fréquentes

- **Le fichier contient une activité horodatée d'une autre personne** : l'import fonctionne mais le parcours hérite d'informations inutiles. Convertissez-le en parcours avec le [Convertisseur GPX ↔ TCX](/outils/convertisseur-gpx-tcx), qui vous dira ce qui est conservé et perdu.
- **Trop de points** : certains appareils limitent le nombre de points par parcours. Simplifiez la trace dans votre outil de cartographie.
- **Pas de coordonnées valides** : un fichier mal exporté peut contenir des points à (0, 0). L'[Inspecteur](/outils/inspecteur-gpx-tcx) le signale.
- **Fuseaux horaires** : les horodatages GPX sont en UTC. Un décalage d'une heure à l'affichage n'est pas une erreur.

## Avant de partager un parcours

Retirez les abords de votre domicile avec l'outil [Confidentialité GPS](/outils/confidentialite-gps), et rappelez-vous qu'un parcours masqué reste partiellement identifiable.
