<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ACode.tech — landing page

Voir l'app dans AI Studio : https://ai.studio/apps/drive/1SP_FENpIjsZXtwsVzYMSVZhMSyBCLsj4

## Démarrage

**Prérequis :** Node.js ≥ 18.17 (le serveur utilise `fetch` global et `node:crypto`).

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:3000
```

`.env.local` est ignoré par git (règle `*.local`). Seul `GEMINI_API_KEY` est
exposé au front ; les identifiants LinkedIn restent côté serveur.

## Build et production

```bash
npm run build   # génère dist/ (front) puis dist-ssr/ (serveur)
npm start       # sert dist/ et l'API sur le même port (défaut : 3000)
```

Le front et l'API **doivent** être servis sur la même origine : le cookie de
session est `SameSite=Lax` et lié à cette origine. Un déploiement purement
statique (sans `npm start`) reste possible — le bouton LinkedIn se masque alors
automatiquement au lieu d'afficher un lien mort.

---

## Connexion LinkedIn (OpenID Connect)

Implémentation de *Sign In with LinkedIn using OpenID Connect* : un visiteur
connecte son compte LinkedIn au site, et l'application récupère son profil
(nom, photo, e-mail).

### 1. Créer l'application LinkedIn

1. Créer une app sur https://www.linkedin.com/developers/apps
2. Onglet **Products** → demander **Sign In with LinkedIn using OpenID Connect**.
   Sans ce produit approuvé, le scope `openid` renvoie `401 Invalid scope`.
3. Onglet **Auth** → relever le *Client ID* et le *Client Secret*.
4. Onglet **Auth** → ajouter la **Redirect URL** :

   ```
   https://acode.tech/api/auth/linkedin/callback
   ```

   Elle doit correspondre au caractère près à `LINKEDIN_REDIRECT_URI` (ou à
   `${APP_BASE_URL}/api/auth/linkedin/callback`). LinkedIn ignore les query
   params et refuse les fragments `#`.

   > **Développement local.** La documentation LinkedIn impose des URLs HTTPS.
   > Le portail accepte généralement `http://localhost:3000/api/auth/linkedin/callback`,
   > mais s'il le refuse, exposez le site via un tunnel HTTPS (ngrok, cloudflared)
   > et alignez `APP_BASE_URL` dessus.

### 2. Renseigner l'environnement

Voir [`.env.example`](.env.example). Variables requises :

| Variable | Rôle |
| --- | --- |
| `LINKEDIN_CLIENT_ID` | Client ID de l'app LinkedIn |
| `LINKEDIN_CLIENT_SECRET` | Client Secret — **jamais côté navigateur** |
| `SESSION_SECRET` | Clé HMAC du cookie de session (32 caractères min.) |
| `APP_BASE_URL` | Origine publique du site |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Une configuration incomplète ne fait pas planter le serveur : `/me` répond
`unconfigured` et l'interface affiche « LinkedIn non configuré ».

### 3. Endpoints exposés

| Méthode | Chemin | Rôle |
| --- | --- | --- |
| `GET` | `/api/auth/linkedin/login` | Pose le cookie `state` et redirige vers LinkedIn |
| `GET` | `/api/auth/linkedin/callback` | Vérifie le `state`, échange le code, ouvre la session |
| `GET` | `/api/auth/linkedin/me` | `authenticated` / `anonymous` / `unconfigured` |
| `POST` | `/api/auth/linkedin/logout` | Purge le cookie de session |

### Architecture

```
server/
  config.ts       chargement + validation de l'environnement
  oauth.ts        client OIDC LinkedIn (auth URL, token, userinfo, ID token)
  session.ts      cookie de session signé en HMAC-SHA256
  cookies.ts      lecture/écriture de cookies
  handler.ts      routeur HTTP indépendant de l'hébergeur
  vite-plugin.ts  montage de l'API sur le serveur de dev Vite
  index.ts        serveur de production (statique + API)
hooks/
  useLinkedInAuth.ts       appels réseau et machine à états
  LinkedInAuthContext.tsx  état partagé entre navbar desktop et mobile
components/
  LinkedInConnect.tsx      bouton de connexion / menu de compte
```

Aucune dépendance n'a été ajoutée : tout repose sur `node:crypto`, `node:http`
et le `fetch` global. Le même routeur sert le dev (middleware Vite) et la prod
(`node:http`).

### Choix de sécurité

- **Le `client_secret` ne peut pas vivre dans le front.** LinkedIn n'expose PKCE
  que sur son flux natif (`/oauth/native-pkce/authorization`, redirection
  loopback, activation manuelle par LinkedIn). Pour une app web, `client_secret`
  est obligatoire à l'échange du code : d'où le backend.
- **Anti-CSRF** : `state` aléatoire de 32 octets, stocké en cookie `HttpOnly` et
  comparé à temps constant au retour.
- **`SameSite=Lax`** sur les cookies du flux : le callback LinkedIn est une
  navigation top-level cross-site, que `Strict` bloquerait.
- **L'`access_token` n'est jamais stocké.** Le cookie de session est signé, pas
  chiffré : il ne contient que des claims d'identité publics.
- **ID token vérifié** : signature RS256 contre le JWKS LinkedIn (avec cache et
  gestion de la rotation de clés), plus contrôle de `iss`, `aud` et `exp`.
- **Pas de redirection ouverte** : les URLs de retour sont construites à partir
  de `APP_BASE_URL`, jamais d'un paramètre client.

Le paramètre `nonce` n'est pas envoyé : LinkedIn ne le documente pas et ne
l'expose pas dans `claims_supported`. En valider un qui n'est jamais renvoyé
ferait échouer toutes les connexions.

### Limites connues

- **Pas de refresh token.** LinkedIn ne les délivre qu'à un nombre restreint de
  partenaires. La session applicative dure 7 jours (`SESSION_TTL_SECONDS`) ;
  au-delà, l'utilisateur repasse par LinkedIn — sans réafficher l'écran de
  consentement s'il y est encore connecté.
- **Sessions sans état.** Il n'existe pas de révocation côté serveur : une
  déconnexion efface le cookie du navigateur. Pour révoquer à distance, il faut
  un stockage de sessions.
- **Connexion seule.** Pour appeler l'API LinkedIn au nom du membre (publier un
  post, etc.), il faut conserver l'`access_token` côté serveur et demander les
  scopes correspondants (`w_member_social`…), soumis à approbation LinkedIn.
