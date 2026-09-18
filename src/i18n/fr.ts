/** Dictionnaire de l'interface (français). Les futures langues dupliqueront ce fichier clé pour clé. */
export const fr = {
  nav: { skip: "Aller au contenu", search: "Rechercher", compare: "Comparer", tools: "Outils", login: "Connexion", account: "Mon compte" },
  common: { unverified: "Non vérifié", notProvided: "Non renseigné", yes: "Oui", no: "Non", readMore: "Lire la suite" },
} as const;
export type Dictionary = typeof fr;
