export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  groups?: NavGroup[];
  featured?: { title: string; description: string; href: string; cta: string };
};

export const primaryNav: NavItem[] = [
  {
    label: "Équipements",
    href: "/equipements",
    groups: [
      {
        title: "Par catégorie",
        links: [
          { label: "Montres running", href: "/equipements?categorie=montre-running" },
          { label: "Montres multisports", href: "/equipements?categorie=montre-multisport" },
          { label: "Équipements outdoor", href: "/equipements?categorie=outdoor" },
          { label: "Bien-être et fitness", href: "/equipements?categorie=bien-etre-fitness" },
          { label: "Compteurs vélo", href: "/equipements?categorie=compteur-velo" },
          { label: "Capteurs et accessoires", href: "/equipements?categorie=capteur-accessoire" },
        ],
      },
      {
        title: "Décider",
        links: [
          { label: "Comparateur", href: "/comparer", description: "2 à 4 modèles, différences uniquement" },
          { label: "Quel Garmin choisir ?", href: "/quel-garmin-choisir", description: "Assistant explicable" },
          { label: "Comparatifs éditoriaux", href: "/comparatifs" },
        ],
      },
    ],
    featured: {
      title: "Toutes les fiches indiquent leurs sources",
      description: "Données constructeur, observations documentées et avis éditoriaux sont distingués. Une valeur inconnue reste « Non vérifié ».",
      href: "/methodologie",
      cta: "Notre méthode",
    },
  },
  {
    label: "Guides",
    href: "/guides",
    groups: [
      {
        title: "Apprendre",
        links: [
          { label: "Guides et tutoriels", href: "/guides" },
          { label: "Fonctionnalités expliquées", href: "/fonctionnalites" },
          { label: "Actualités", href: "/actualites" },
        ],
      },
      {
        title: "Par sport",
        links: [
          { label: "Running", href: "/sport/running" },
          { label: "Trail", href: "/sport/trail" },
          { label: "Cyclisme", href: "/sport/cyclisme" },
          { label: "Triathlon et natation", href: "/sport/triathlon" },
          { label: "Randonnée", href: "/sport/randonnee" },
        ],
      },
    ],
  },
  {
    label: "Outils",
    href: "/outils",
    groups: [
      {
        title: "Fichiers GPS",
        links: [
          { label: "Inspecteur GPX / TCX", href: "/outils/inspecteur-gpx-tcx" },
          { label: "Convertisseur GPX ↔ TCX", href: "/outils/convertisseur-gpx-tcx" },
          { label: "Confidentialité GPS", href: "/outils/confidentialite-gps" },
        ],
      },
      {
        title: "Entraînement",
        links: [
          { label: "Allure, vitesse et temps", href: "/outils/allure-vitesse-temps" },
          { label: "Zones de fréquence cardiaque", href: "/outils/zones-frequence-cardiaque" },
          { label: "Stratégie de course", href: "/outils/strategie-de-course" },
        ],
      },
    ],
    featured: {
      title: "Vos fichiers restent dans votre navigateur",
      description: "Les outils traitent GPX et TCX localement. Aucun fichier sportif n'est envoyé sur un serveur.",
      href: "/outils#confidentialite",
      cta: "Comment ça marche",
    },
  },
  { label: "Communauté", href: "/communaute" },
];

export const footerNav: NavGroup[] = [
  {
    title: "Explorer",
    links: [
      { label: "Actualités", href: "/actualites" },
      { label: "Équipements", href: "/equipements" },
      { label: "Comparateur", href: "/comparer" },
      { label: "Quel Garmin choisir ?", href: "/quel-garmin-choisir" },
      { label: "Guides et tutoriels", href: "/guides" },
      { label: "Fonctionnalités expliquées", href: "/fonctionnalites" },
    ],
  },
  {
    title: "Outils gratuits",
    links: [
      { label: "Inspecteur GPX / TCX", href: "/outils/inspecteur-gpx-tcx" },
      { label: "Convertisseur GPX ↔ TCX", href: "/outils/convertisseur-gpx-tcx" },
      { label: "Confidentialité GPS", href: "/outils/confidentialite-gps" },
      { label: "Allure, vitesse et temps", href: "/outils/allure-vitesse-temps" },
      { label: "Zones de fréquence cardiaque", href: "/outils/zones-frequence-cardiaque" },
      { label: "Stratégie de course", href: "/outils/strategie-de-course" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Forum", href: "/communaute" },
      { label: "Règles communautaires", href: "/regles-communautaires" },
      { label: "Créer un compte", href: "/inscription" },
      { label: "Se connecter", href: "/connexion" },
    ],
  },
  {
    title: "Le site",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Méthodologie éditoriale", href: "/methodologie" },
      { label: "Contact", href: "/contact" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Conditions d'utilisation", href: "/conditions-utilisation" },
    ],
  },
];
