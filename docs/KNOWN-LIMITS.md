# Limites connues

## Contenu et données
- **Photographies** : aucune image dont l'usage est autorisé n'est disponible. Tous les visuels sont des SVG générés, marqués « Visuel provisoire » hors production.
- **Logo** : composition typographique provisoire, pas un logo officiel (voir docs/BRAND.md).
- **Catalogue** : couvre uniquement les modèles dont la fiche officielle a pu être lue lors de la collecte ; chaque fiche porte sa date de vérification et ses sources. Aucune observation issue de tests réels : la section correspondante est vide et le dit.
- **Prix** : prix constructeur du marché indiqué (EUR, fr-FR) à la date de consultation ; aucun prix marocain constaté.
- **Actualités** : aucune actualité publiée à la livraison ; un gabarit existe en brouillon. La rubrique affiche un état vide honnête.
- **Comparatifs éditoriaux** : rubrique créée, aucun article publié à la livraison (prévus au calendrier éditorial, semaines 5 à 12).

## Fonctionnel
- **E-mails** : aucun service configuré → pas de réinitialisation de mot de passe, pas de formulaire de contact, pas de notifications. Les pages le disent explicitement.
- **Pièces jointes du forum** : désactivées tant que stockage, redimensionnement et modération ne sont pas en place.
- **Suppression de compte** : sur demande via Contact (pas de libre-service).
- **Recherche** : `ILIKE` simple ; une recherche plein texte PostgreSQL est prévue.
- **FIT** : non pris en charge (roadmap V2, après vérification d'une bibliothèque).
- **Cartes** : l'aperçu cartographique dépend d'un fournisseur de tuiles externe configuré par variable d'environnement ; désactivé par défaut si la variable est vide.
- **Conversions** : jamais sans perte ; le rapport liste les champs conservés, transformés et perdus. Les tours (laps) TCX sont perdus en GPX ; un GPX sans horodatage devient un parcours TCX.
- **Anonymisation GPS** : masque une zone autour du départ et de l'arrivée, ne rend pas un parcours anonyme.

## Technique
- **Serveur de développement** dans l'environnement d'exécution distant utilisé pour ce projet : la connexion WebSocket HMR échoue derrière le proxy, ce qui empêche l'hydratation côté client en `next dev` **dans cet environnement uniquement**. Le build de production (`npm run build && npm run start`) s'hydrate normalement (vérifié par Playwright).
- **Mesure terrain** : LCP/INP/CLS au 75e percentile ne peuvent être mesurés qu'avec du trafic réel ; seules des vérifications de laboratoire ont été faites.
- **Search Console et mesure d'audience** : non configurées (nécessitent l'accès au domaine). Préparées dans la checklist.
- **DNS / domaine / marque** : aucune vérification de propriété du domaine ni d'autorisation d'usage de la marque n'a été faite ; inscrit dans la checklist de lancement.
- **Multilingue** : architecture préparée, arabe non publié.
- **Auto-validation éditoriale** : un éditeur peut valider son propre article ; l'action est journalisée avec la mention « auto-validation ».
