# Roadmap V2

Aucune date n'est promise. Chaque élément entre en développement après étude de faisabilité.

## Outils
1. **Lecture de fichiers FIT** — condition : choisir une bibliothèque (licence compatible, maintenue), documenter les champs non lus et les pertes.
2. **Conversion FIT → GPX/TCX** avec le même rapport de pertes que le convertisseur actuel.
3. **Découpage et fusion d'activités** (par temps, distance ou segment), avec recalcul des résumés et avertissements sur les tours.
4. **Création de parcours** (dessin sur carte, import de waypoints), export GPX/TCX ; nécessite un fournisseur de tuiles et de routage documenté.
5. **Analyse de couverture des données** : champs manquants par segment, taux d'échantillonnage, qualité GPS.

## Produit
- Réinitialisation de mot de passe et suppression de compte en libre-service (après configuration d'un service d'e-mail).
- Formulaire de contact.
- Pièces jointes sur le forum (images) après mise en place du stockage, du redimensionnement, de la suppression des métadonnées EXIF et de la modération.
- Recherche plein texte PostgreSQL (tsvector, français) en remplacement des recherches `ILIKE`.
- Notifications de réponses (e-mail, opt-in).
- Éditeur Markdown avec aperçu dans le back-office.
- Historique des révisions d'articles et de fiches.
- Version arabe (RTL) selon docs/I18N.md.

## Contenu
- Extension du catalogue (accessoires, capteurs, anciennes générations encore vendues).
- Comparatifs éditoriaux par profil (débutant route, traileur longue distance, triathlète).
- Tests réels avec protocole publié, alimentant la section « Observations documentées ».
