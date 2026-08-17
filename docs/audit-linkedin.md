# Audit du profil LinkedIn — Anass Mouakkid

**Profil :** [linkedin.com/in/anassmouakkid](https://www.linkedin.com/in/anassmouakkid/)
**Poste relevé :** Plastic Molding Manager — Varun Beverages Morocco (PepsiCo), Casablanca
**Date de relevé :** 17 août 2026

---

## 0. Méthode et limites

Aucune connexion au compte LinkedIn n'a été effectuée. LinkedIn renvoie `HTTP 429` sur les
pages profil depuis une IP de datacenter (protection anti-robot), navigateur headless compris.
Une tentative de connexion depuis une IP inhabituelle est par ailleurs le déclencheur classique
d'un verrouillage de compte.

Sources réellement exploitées :

- index public du profil LinkedIn (titre, poste, missions, signaux de recommandations) ;
- mémoire MBA GEMBA P23 — TBS Casablanca (présent sur le poste de travail) ;
- Google Drive (CV, résumés exécutifs, briefs de portrait) ;
- CV Indeed ;
- code source du site ACode.tech (ce dépôt).

Six postes de contrôle restent non vérifiables sans accès direct : photo, bannière, section
Infos, Sélection, compétences, activité.

**Bilan : 2 non conformes · 2 conformes · 6 non vérifiables.**

---

## 1. Diagnostic central

Titre actuel : `PLASTIC MOLDING MANAGER - VARUN BEVERAGES MOROCCO (PepsiCo)`

Il est exact, et c'est son seul mérite. Il décrit une fonction exercée par des milliers de
personnes, avec une expression que quasiment personne ne recherche. Trois actifs réellement
rares n'apparaissent nulle part :

1. **Terrain lourd** — démarrage et montée en cadence de lignes Husky et Sacmi (IM & ICM),
   70+ personnes en équipes postées.
2. **Recherche primaire** — mémoire MBA fondé sur 10 entretiens semi-directifs avec des
   directeurs supply chain marocains, 6 hypothèses dont 2 contre-intuitives, résultats chiffrés.
3. **Capacité de construction** — développement logiciel effectif (ACode.tech), et non simple
   pilotage de prestataires.

Chacun pris isolément est trouvable. **L'intersection des trois, au Maroc, dans le FMCG, est
presque introuvable** — et c'est précisément ce que le profil n'exprime pas.

---

## 2. Postes de contrôle

| Poste de contrôle | État observé | Cible | Verdict |
|---|---|---|---|
| Titre (headline) | 58 car. / 220, capitales, aucun mot-clé stratégique | 180–220 car., 3–5 mots-clés | **Critique** |
| Description du poste | Liste de tâches, aucun résultat chiffré | 4–6 lignes de résultats chiffrés | **Majeur** |
| URL personnalisée | `/in/anassmouakkid` | Prénom + nom, sans chiffres | Conforme |
| Recommandations | Présentes | 5+, réparties | Conforme |
| Photo de profil | Non accessible | Portrait pro, fond neutre | Non vérifié |
| Bannière | Non accessible | 1584 × 396 px, porteuse de message | Non vérifié |
| Section « Infos » | Non accessible | 1 800–2 600 car. | Non vérifié |
| Sélection (Featured) | Non accessible | 3 éléments dont le mémoire | Non vérifié |
| Compétences | Non accessible | 25, top 3 épinglées | Non vérifié |
| Activité | Non accessible | 2 publications / semaine | Non vérifié |

---

## 3. Constats détaillés

### C-01 — Critique : le titre gaspille 74 % du champ le plus indexé

Le titre est, avec le nom, le champ le plus lourdement pesé par le moteur LinkedIn. C'est aussi
le seul texte qui suit le profil partout : résultats de recherche, sous chaque commentaire,
invitations, notifications.

- 58 caractères sur 220 disponibles.
- Capitales : aucun gain de référencement (LinkedIn est insensible à la casse), lecture agressive.
- Employeur dupliqué — il s'affiche déjà dans l'expérience juste en dessous.
- « Plastic molding » n'est pas une requête. Le marché tape « responsable production »,
  « supply chain », « excellence opérationnelle », « industrie 4.0 ».

### C-02 — Majeur : l'actif le plus rare est enfermé dans un PDF

Le mémoire est un jeu de données, pas un exercice scolaire. Résultats saillants :

- la maturité des données est la variable modératrice dominante (plus que l'algorithme) ;
- les filiales de multinationales gagnent 15 à 18 points de MAPE ; une large part du tissu
  national pilote encore sous Excel et à l'intuition commerciale ;
- la sur-automatisation **dégrade** la résilience (hypothèse H5 confirmée).

Ce dernier point a de la valeur parce qu'il contredit le discours ambiant. Il y a là environ
douze mois de publications à angle fort sur un sujet où le marché marocain ne dispose
quasiment d'aucune donnée originale.

### C-03 — À corriger : incohérences entre plateformes

Indeed indique encore **INGELEC — poste en cours** ; LinkedIn situe le poste chez Varun
Beverages depuis janvier 2024. Le CV Drive le plus récent date de juin 2023. Les recruteurs
croisent les sources ; l'incohérence coûte de la crédibilité avant l'entretien.

### C-04 — À corriger : description de poste orientée mission, pas résultat

« Élaborer les SOP », « mettre en place des tableaux de bord », « coordonner les activités » :
identique pour n'importe quel titulaire du poste. Manquent les chiffres — TRS, taux de rebut,
délai de montée en cadence, temps de changement de moule.

### C-05 — Fenêtre en train de se refermer

Clôture analytique du mémoire le 14 mars 2026 ; relevé effectué le 17 août 2026. Le pic
d'attention (soutenance, diplôme) est passé. Angle de rattrapage : « cinq mois après ma
soutenance, voici ce que le terrain a confirmé — et ce qu'il a démenti. »

---

## 4. Titre — versions prêtes à coller

**Version A — Convergence (recommandée, 152 car.)**

```
Production Manager chez Varun Beverages (PepsiCo) | Injection PET & Industrie 4.0 | IA appliquée à la Supply Chain FMCG | MBA Management Stratégique TBS
```

**Version B — Trajectoire direction industrielle (148 car.)**

```
Responsable Production & Supply Chain FMCG | Excellence opérationnelle, Lean & Industrie 4.0 | Prévision de la demande par IA | MBA TBS Casablanca
```

**Version C — Autorité et acquisition (150 car.)**

```
J'aide l'industrie FMCG marocaine à passer du pilotage Excel au demand-driven prédictif | Production Manager (PepsiCo) | MBA TBS | Fondateur ACode.tech
```

> L'intitulé « Fondateur » est déduit de ce dépôt — à confirmer avant publication.

---

## 5. Section « Infos » — prête à coller (≈ 1 950 / 2 600 car.)

```
Une ligne d'injection qui démarre à trois heures du matin ne ment jamais. Soit le process
tient, soit il ne tient pas.

J'ai passé douze ans de ce côté-là du mur. Aujourd'hui je pilote l'injection PET chez Varun
Beverages Morocco (PepsiCo) à Casablanca : démarrage et montée en cadence des lignes Husky et
Sacmi, construction du socle standard (SOP, instructions de travail, standards de changement
de moule), pilotage par KPI, et l'organisation de plus de 70 personnes en équipes.

En parallèle, j'ai consacré deux ans à une question que le terrain m'imposait : l'intelligence
artificielle rend-elle vraiment une supply chain FMCG plus résiliente — ou fabrique-t-elle
surtout de nouvelles fragilités ?

C'est le sujet de mon mémoire de MBA Management Stratégique (TBS Casablanca, GEMBA P23),
construit sur dix entretiens avec des directeurs supply chain marocains. Trois résultats en
sont sortis :

→ La maturité des données pèse plus lourd que l'algorithme. C'est elle qui explique
l'essentiel des écarts de performance, pas le choix du modèle.

→ Les filiales de multinationales gagnent 15 à 18 points de MAPE sur leurs prévisions. Une
large part du tissu national pilote encore sous Excel et à l'intuition commerciale.

→ La sur-automatisation dégrade la résilience. Sortir l'humain de la boucle a un coût, et il
se paie exactement au moment de la perturbation.

Ce qui m'intéresse, c'est la jonction : faire descendre ces modèles dans un atelier marocain
réel, avec ses contraintes réelles — saisonnalité Ramadan et Aïd, volatilité de la demande,
coexistence du formel et de l'informel, équipes à former.

Je construis aussi les outils. ACode.tech, à Casablanca, développe ce qui manque entre l'ERP
et le terrain : applications métier, tableaux de bord, mise en production de modèles.

Écrivez-moi si vous travaillez sur la prévision de la demande, le DDMRP, un démarrage de
ligne, l'excellence opérationnelle FMCG ou la digitalisation d'atelier.

contact@acode.tech
```

---

## 6. Expérience — prête à coller

```
Pilotage de l'unité d'injection PET (Injection Molding & Injection Compression Molding) sur
le site de Casablanca.

• Démarrage et qualification des lignes Husky et Sacmi, de la réception machine jusqu'à la
  cadence nominale atteinte en [X] semaines.
• Direction de plus de 70 opérateurs et techniciens en équipes postées : matrice de
  polyvalence, plan de montée en compétence, organisation des relèves.
• Construction du référentiel opératoire depuis zéro — SOP, instructions de travail, standards
  de changement de moule — ramenant le temps de changement de [X] à [X] minutes.
• Mise en place du système de pilotage : tableaux de bord TRS, rebut et temps de cycle, avec
  reporting hebdomadaire à la direction. TRS porté à [X] %, taux de rebut ramené à [X] %.
• [Un fait marquant : incident résolu, économie obtenue, audit passé.]

Compétences : Injection plastique · Démarrage d'installations · Management d'équipes postées ·
TRS/OEE · Amélioration continue · FMCG
```

Les crochets sont les chiffres manquants — ils sont le cœur de la valeur ajoutée.

---

## 7. Compétences et mots-clés

**Trois compétences à épingler** (poids fort dans le classement des recherches) :

1. Supply Chain Management
2. Gestion de production
3. Industrie 4.0

**Compléter jusqu'à 25** (au-delà, le signal se dilue) : Injection plastique · Injection
Molding · Démarrage d'installations · Lean Manufacturing · Amélioration continue · TRS/OEE ·
Prévision de la demande · DDMRP · Demand Planning · S&OP · FMCG · Management d'équipe ·
Excellence opérationnelle · Gestion de projet industriel · Intelligence artificielle ·
Machine Learning · Analyse de données · Power BI · SAP · Résolution de problèmes ·
Sécurité industrielle · Maintenance

**Bannière** — 1584 × 396 px : phrase de positionnement en gros, mention TBS et contact en
petit, sur une photo de ligne d'injection. Espace le plus visible du profil, presque toujours
laissé vide.

**Sélection** — trois éléments : résumé exécutif du mémoire (le PDF existe déjà dans le Drive),
lien ACode.tech, meilleure publication une fois le rythme lancé.

---

## 8. Plan 90 jours

Un profil optimisé sans activité reste invisible : LinkedIn distribue à l'engagement, pas à la
complétude. Le profil est le point d'atterrissage, la publication est ce qui y amène.

### Jours 1–2 — Socle

Titre (version A), section Infos, description de poste chiffrée, 25 compétences dont 3
épinglées, bannière, Sélection. Alignement Indeed ↔ LinkedIn. Activation du mode créateur.

Tout faire en une seule séance, avec « informer le réseau » désactivé pendant les retouches —
sinon chaque correction déclenche une notification et brûle l'audience à vide.

### Semaines 1–2 — Amorçage

Publication d'ouverture : « Cinq mois après ma soutenance, voici les trois résultats que le
terrain a confirmés. »

Puis, quotidiennement : cinq commentaires de fond sous des publications de directeurs supply
chain et industriels marocains — désaccord argumenté ou cas vécu, jamais « super post ».
Levier de portée le plus sous-estimé : on emprunte l'audience d'un autre, et le titre s'affiche
sous chaque commentaire.

### Semaines 3–8 — Rythme

Deux publications par semaine, en alternant quatre registres :

- **Atelier** — ce qu'un démarrage de ligne enseigne et qu'aucun manuel ne dit.
- **Recherche** — le mémoire en épisodes : une hypothèse, un résultat, une implication.
- **Secteur** — lecture du FMCG marocain : saisonnalité Ramadan/Aïd, informel, volatilité.
- **Construction** — ce qui se bâtit chez ACode.tech, raisonnement à l'appui.

Connexions : 15 à 20 par semaine, ciblées (supply chain, industrie, FMCG, Maroc), toujours
avec note personnalisée.

### Semaines 9–12 — Consolidation

Trois recommandations demandées avec un angle suggéré à chacun (un pair de Varun, un ancien
d'INGELEC, un intervenant du MBA) — une recommandation vague ne sert à rien.

Synthèse longue du mémoire publiée en article natif LinkedIn plutôt qu'en PDF : le texte natif
est indexé, le PDF ne l'est pas. Puis relecture des statistiques d'audience et renforcement du
registre qui a réellement pris.

---

## 9. Éléments manquants

- **Objectif réel** — poste de direction industrielle, clients ACode.tech, ou voix d'expert ?
  La version A ne ferme aucune porte, mais un arbitrage resserrerait nettement titre, Infos et
  plan de contenu.
- **Statut d'ACode.tech vis-à-vis de l'employeur** — conditionne la place de l'agence sur le profil.
- **Chiffres de production** — TRS, rebut, délai de montée en cadence, temps de changement de moule.
- **Contenu actuel du profil** (copie ou export PDF) — pour compléter les six lignes non vérifiées.
