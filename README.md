<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ACode.tech — Landing Page

Landing page haut de gamme pour une agence digitale (développement Mobile/Web,
Cybersécurité et SEO), construite avec React 19, Vite et Tailwind CSS.

## Prérequis

- Node.js 18 ou plus récent

## Lancer en local

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```
   Le site est servi sur http://localhost:3000

## Build de production

```bash
npm run build     # génère le dossier dist/
npm run preview   # sert le build de production en local
```

Déployez le contenu du dossier `dist/` sur n'importe quel hébergement statique
(Apache, Nginx, Netlify, Vercel, cPanel...).

## Stack technique

- **React 19** + **TypeScript**
- **Vite 6** pour le bundling
- **Tailwind CSS 3** (build local, plus de CDN)
- **framer-motion** pour les animations
- **lucide-react** pour les icônes
