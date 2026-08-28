# Rapport d'acquisition — 1 domaine, budget 50 $, revente 30–90 jours

**Date d'analyse : 28 août 2026** · Toutes les heures en UTC
**Analyste : audit domaines expirés & hand-reg**

---

## 1. CONCLUSION D'INVESTISSEMENT

### VERDICT : **AUCUN ACHAT AUJOURD'HUI**

**Meilleur candidat trouvé : RehabClaims.com — score 48/100 — REJECT**
(seuil de recommandation : 82/100 ; écart : **-34 points**)

Aucun des 62 domaines vérifiés disponibles ce jour n'atteint le seuil. Ce n'est pas
un échec de sourcing : c'est un résultat **structurel**, démontré ci-dessous.

### Pourquoi — la démonstration en 3 chiffres vérifiés

| Fait vérifié | Source | Conséquence sur le score |
|---|---|---|
| Sell-through rate d'un hand-reg = **~0,5 %/an** | NamePros, Brandpa, Domavest (28/08/2026) | Probabilité de vente sur 30–90 j ≈ **0,1–0,15 %**. Critère 2 plafonné à 5/20 |
| Domaine jamais enregistré = **0 backlink, DR 0** | RDAP Verisign (certitude structurelle) | Critère 4 = **0/15 par construction** |
| **0/62** candidats ont une racine utilisée sur un autre TLD (.io/.co/.net/.org/.ai/.app) | `dig NS`, 28/08/2026 11:00 UTC | « Signal négatif » au sens du §4.3 du brief. Critère 1 plafonné à ~15/30 |

**Plafond mathématique d'un hand-reg neuf avec cette grille :**
`15 (C1) + 5 (C2) + 13 (C3) + 0 (C4) + 10 (C5) + 10 (C6) = 53/100`
Même en notant chaque critère au maximum atteignable, **82 est inaccessible**.

### Pourquoi je n'ai pas basculé sur les domaines expirés

C'était la seule voie vers 82+ (backlinks réels + historique = 30 points en jeu).
Elle est **fermée dans cet environnement** :

| Outil requis par le brief | Statut testé aujourd'hui |
|---|---|
| Wayback Machine (§5.2, exclusion toxique) | **INACCESSIBLE** — bloqué par la politique réseau (403 egress) en `curl` **et** en fetch |
| Ahrefs / Majestic / Moz (§5.3) | **INDISPONIBLE** — aucun connecteur dans cette session |
| NameBio (§5.6, comps) | **INACCESSIBLE** — anti-bot, 403 + redirection `/relax` |

Acheter un domaine expiré sans pouvoir vérifier ni son historique ni ses backlinks,
c'est exactement ce que le §5.2 interdit (« exclusion immédiate au moindre épisode
toxique »). Avec 50 $ qui sont votre dernière cartouche, acheter à l'aveugle un
domaine dont le passé peut être un PBN, du spam ou pire n'est pas un pari : c'est
une perte probable.

**Ce que la contrainte de temps change :** votre objectif (20x en 30–90 jours) exige
un acheteur déjà motivé. Un nom inventé que personne n'utilise nulle part n'a, par
définition, aucun acheteur en attente. Les deux objectifs — *pas cher* et *vendu vite*
— ne se rencontrent pas sur le marché du hand-reg.

### Les 2 pièges détectés et évités aujourd'hui

Ces deux domaines étaient « disponibles » et seraient passés un filtre superficiel :

- **PalletHarbor.com** — sous-domaine `pay.palletharbor.com` scanné le 27/05/2024
  (urlscan.io). Un sous-domaine « pay. » sur un domaine aujourd'hui tombé est un
  marqueur classique de kit de phishing. **Écarté.**
- **SolarQuill.com** — 15 scans urlscan avec `utm_source=Farm3-2545&utm_campaign=`,
  signature d'une ferme de parking / PBN. **Écarté.**

### Les 3 principaux risques si vous passiez outre

1. **Risque de liquidité (majeur).** À 0,5 % de STR, un domaine unique a ~1 chance
   sur 800 de se vendre dans votre fenêtre de 90 jours. Vous perdriez 11 $ + le temps.
2. **Risque d'historique non vérifiable.** Sans Wayback, aucun domaine ayant déjà
   existé ne peut être validé. Un passé toxique tue la valeur de revente ET peut
   entraîner un blacklistage e-mail chez l'acheteur.
3. **Risque de marque non purgé.** Sans accès API à USPTO/EUIPO/OMPIC, la recherche
   web seule ne suffit pas à écarter une marque déposée dans une classe proche.

---

## 2. TABLEAU DES 10 FINALISTES

Disponibilité re-vérifiée par RDAP Verisign le **28/08/2026 à 11:03:10 UTC**.
Prix : Porkbun API officielle, vérifiée à **11:02:23 UTC** — **.com = 11,08 $**
enregistrement **et** renouvellement (aucun premium possible : Verisign applique un
tarif de gros unique sur .com, donc un .com jamais enregistré ne peut pas être premium).

| # | Domaine | Prix | Registrar | Âge | Snapshots | Historique | DR | TF | Ref. dom. | Blacklists | Marques | Comps NameBio | Acheteurs | Score | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **RehabClaims.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** (Wayback bloqué) | 0 scan urlscan | **0** | **0** | **0** | Propre (0 scan) | Rien trouvé (web seul) | **NON VÉRIF.** | 5+ | **48** | REJECT |
| 2 | **PatchHarbor.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 7 | **48** | REJECT |
| 3 | **RemitHarbor.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 6 | **47** | REJECT |
| 4 | **PayerClaims.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 5 | **46** | REJECT |
| 5 | **RemitFort.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 6 | **46** | REJECT |
| 6 | **ClearChurn.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 5 | **45** | REJECT |
| 7 | **RemitPeak.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 6 | **44** | REJECT |
| 8 | **HeatPumpOps.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 4 | **41** | REJECT |
| 9 | **NileLedger.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 3 | **41** | REJECT |
| 10 | **CipherFlint.com** | 11,08 $ | Porkbun | 0 j | **NON VÉRIF.** | 0 scan urlscan | **0** | **0** | **0** | Propre | Rien trouvé | **NON VÉRIF.** | 3 | **40** | REJECT |

**Lecture de la colonne DR/TF/Ref. dom. :** ce ne sont pas des « non vérifiés ». Un
domaine jamais enregistré a nécessairement zéro backlink. C'est une **certitude**, et
elle coûte les 15 points du critère 4 à chacun des 10 finalistes.

---

## 3. FICHES DÉTAILLÉES DES 3 MEILLEURS

### 3.1 — RehabClaims.com — 48/100

**Détail du score :** C1 acheteurs 16/30 · C2 ratio+rapidité 5/20 · C3 historique 11/15 ·
C4 backlinks 0/15 · C5 brandabilité 8/10 · C6 extension/juridique 8/10

**Preuves consultées (28/08/2026)**
- Disponibilité : `rdap.verisign.com/com/v1/domain/RehabClaims.com` → HTTP 404 — **11:03:10 UTC**
- Disponibilité (2e source) : connecteur GoDaddy, `available: true` — **10:54 UTC**
- Prix : `api.porkbun.com/api/json/v3/pricing/get` → com 11,08 $ reg. / 11,08 $ renouv. — **11:02:23 UTC**
- Historique : `urlscan.io/api/v1/search/?q=domain:rehabclaims.com` → **total 0** — **10:57 UTC**
- Autres TLD : `dig NS` sur .io/.co/.net/.org/.ai/.app → **aucun enregistré** — **10:56 UTC**
- Marché : pertes de **3,7 Md$/an** en erreurs de facturation en santé comportementale US

**Acheteurs finaux réels et localisables (5+)**
1. **TherapyPM** — plateforme de facturation dédiée, axée gestion des demandes de remboursement
2. **CentralReach** — système de facturation multi-sites pour cabinets en rééducation
3. **BehaveHealth** — RCM santé comportementale, cœur de cible exact
4. **Passage Health** — plateforme clinique + facturation comportementale
5. **SPRY PT** — RCM kinésithérapie/rééducation
6. **CodeMax MB / MDeRCM** — prestataires de facturation externalisée

**Pourquoi ça ne suffit pas :** ces sociétés ont déjà leur marque et leur domaine.
Aucune n'a de raison **urgente** d'acheter ce nom. « Acheteur identifiable » ≠ « acheteur
motivé », et c'est cette différence qui fait échouer le critère 1 et le délai de 90 jours.

**Plan de revente (si vous passiez outre)**
- BIN : 1 895 $ sur Afternic (fast transfer) + Dan, mise en vente immédiate
- Canaux : Afternic/Dan pour l'exposition passive ; démarchage direct par e-mail
- Délai réaliste : **12–36 mois**, pas 30–90 jours

**Modèle d'e-mail d'approche (5 lignes)**
> Objet : RehabClaims.com — disponible pour votre activité de facturation
> Bonjour [Prénom],
> Je détiens RehabClaims.com et vous contacte en priorité avant mise en vente publique.
> Le nom décrit exactement votre métier et se retient au téléphone, sans épellation.
> Je le cède à 1 895 $, transfert sous 24 h via Afternic. Souhaitez-vous que je vous le réserve ?
> [Signature]

---

### 3.2 — PatchHarbor.com — 48/100

**Détail du score :** C1 15/30 · C2 5/20 · C3 11/15 · C4 0/15 · C5 8/10 · C6 9/10

**Preuves (28/08/2026)** — RDAP → 404 à **11:03:10 UTC** · GoDaddy `available: true` à
**10:54 UTC** · urlscan **total 0** à **10:57 UTC** · aucun autre TLD enregistré à **10:56 UTC**

**Acheteurs finaux réels (7)**
1. **Action1** — éditeur spécialiste du patch management, marketing très actif
2. **Automox** — patching cloud, positionnement sécurité
3. **NinjaOne** — RMM avec module de patching
4. **Atera** — RMM PME
5. **Heimdal Security** — patching + sécurité
6. **PDQ Deploy & Inventory** — déploiement/patching
7. **Patch My PC** — spécialiste, nom déjà orienté « patch »

**Faiblesse :** « Harbor » n'ajoute aucune valeur métier au-delà d'une image de sécurité.
Aucun de ces acteurs ne cherche à se renommer. Même impasse sur le délai.

**Plan de revente :** BIN 1 495 $, Afternic + Dan, démarchage direct. Délai réaliste 12–36 mois.

**E-mail d'approche (5 lignes)**
> Objet : PatchHarbor.com
> Bonjour [Prénom],
> PatchHarbor.com est disponible et j'ai pensé à [Société] avant de le lister publiquement.
> Il fonctionne aussi bien en nom de produit qu'en domaine de campagne pour votre offre de patching.
> Prix ferme 1 495 $, transfert immédiat via Afternic. Intéressé ?
> [Signature]

---

### 3.3 — RemitHarbor.com — 47/100

**Détail du score :** C1 14/30 · C2 5/20 · C3 11/15 · C4 0/15 · C5 8/10 · C6 9/10

**Preuves (28/08/2026)** — RDAP → 404 à **11:03:10 UTC** · GoDaddy `available: true` à
**10:54 UTC** · urlscan **total 0** à **10:57 UTC** · aucun autre TLD enregistré à **10:56 UTC**

**Acheteurs finaux réels (6)** — marché des transferts africains projeté **> 60 Md$ en 2026**
1. **LemFi** — 53 M$ Série B (janv. 2025), > 1 Md$ de volume mensuel
2. **NALA** — 40 M$ Série A (juil. 2024), > 1 Md$ transférés
3. **HyperPay** — 36,7 M$ (juin 2026), tour mené par Mastercard, expansion Égypte/Qatar/Oman
4. **Remi** — créée en 2025, levée non divulguée (avril 2026), repense les flux transfrontaliers
5. **TapTap Send** — remises consommateurs
6. **Afriex / Africhange** — remises multi-devises, comptes USD virtuels, stablecoins

**Faiblesse :** c'est le candidat avec les acheteurs les mieux financés — mais tous sont
déjà nommés et installés. Un acquéreur ne paierait que dans le cadre d'un rebranding,
événement rare et imprévisible, incompatible avec une fenêtre de 90 jours.

**Plan de revente :** BIN 2 495 $, Afternic + Dan + Sedo. Délai réaliste 12–36 mois.

**E-mail d'approche (5 lignes)**
> Objet : RemitHarbor.com — nom disponible pour le corridor [X]
> Bonjour [Prénom],
> Je détiens RemitHarbor.com et le propose en priorité aux acteurs des transferts transfrontaliers.
> « Remit » dit le métier, « Harbor » dit la sécurité des fonds — utile pour une marque grand public.
> 2 495 $, transfert sous 24 h via Afternic. Voulez-vous que je vous l'immobilise 48 h ?
> [Signature]

---

## 4. LONGUE LISTE — 62 CANDIDATS VÉRIFIÉS DISPONIBLES, ET POURQUOI ILS SONT ÉCARTÉS

**Méthode de sourcing :** 597 candidats construits sur 8 niches à forte demande
(IA appliquée, fintech/paiements, énergie/solaire, logistique, cybersécurité, santé,
SaaS B2B, marchés MENA/Afrique), puis screening RDAP Verisign intégral en 4 vagues.
**Taux de disponibilité mesuré : 62/597 = 10,4 %** — le marché .com est saturé sur tous
les motifs commerciaux exacts (vague 4, termes métier purs : seulement **3 libres sur 117**).

### Les 52 candidats non retenus comme finalistes

| Domaine | Raison de l'écartement |
|---|---|
| PalletHarbor.com | **Historique toxique** : `pay.` sous-domaine scanné 27/05/2024 — marqueur de phishing |
| SolarQuill.com | **Historique toxique** : 15 scans urlscan, `utm_source=Farm3-2545` — ferme de parking/PBN |
| SwiftQuota.com | Risque de marque : « Swift » = réseau financier SWIFT, conflit en classe proche |
| SwiftChurn.com | Risque de marque : « Swift » (SWIFT / langage Apple) |
| LedgerPrism.com | 12 caractères, deux mots abstraits, aucun acheteur motivé identifiable |
| ChurnClerk.com | « Clerk » = mot à faible désirabilité commerciale ; Clerk.com est un acteur auth établi |
| ClinicClerk.com | Idem « Clerk » ; sonne administratif, pas produit |
| GridClerk.com | Idem « Clerk » ; racine inutilisée nulle part |
| PatchClerk.com | Idem « Clerk » ; PatchHarbor lui est supérieur sur la même niche |
| QuotaClerk.com | Idem « Clerk » ; connotation dévalorisante pour une équipe commerciale |
| RehabClerk.com | Idem « Clerk » ; RehabClaims lui est très supérieur |
| RiskClerk.com | Idem « Clerk » |
| ThreatClerk.com | Idem « Clerk » ; incohérent en cybersécurité (registre trop administratif) |
| VaultClerk.com | Idem « Clerk » |
| VectorClerk.com | Idem « Clerk » ; « Vector » très encombré en cyber |
| ChurnQuill.com | « Quill » = suffixe sans lien métier ; libre car sans demande |
| EvalQuill.com | Idem « Quill » ; « Eval » trop jargon interne IA |
| FreightQuill.com | Idem « Quill » ; incohérent (plume/logistique) |
| OnboardQuill.com | Idem « Quill » ; 13 caractères |
| QuotaQuill.com | Idem « Quill » |
| RehabQuill.com | Idem « Quill » |
| RenewQuill.com | Idem « Quill » |
| RiskQuill.com | Idem « Quill » |
| SeatQuill.com | Idem « Quill » ; « Seat » sans contexte SaaS explicite |
| ThreatQuill.com | Idem « Quill » |
| VaultQuill.com | Idem « Quill » |
| WattQuill.com | Idem « Quill » |
| ChurnSlate.com | « Slate » générique, aucune preuve de demande |
| HaulSlate.com | Idem « Slate » ; « Haul » peu utilisé en marque |
| PatchSlate.com | Idem « Slate » |
| QuotaSlate.com | Idem « Slate » |
| RemitSlate.com | Idem « Slate » ; RemitHarbor supérieur |
| RenewSlate.com | Idem « Slate » |
| ThreatSlate.com | Idem « Slate » |
| ChurnFort.com | « Fort » redondant hors sécurité ; ClearChurn supérieur |
| ChurnNest.com | « Nest » = marque Google notoire, risque de confusion |
| ClinicFort.com | « Fort » incohérent en santé |
| ClinicRail.com | « Rail » sans lien métier |
| HaulRail.com | Ambigu : suggère le ferroviaire, pas le logiciel |
| PalletFort.com | « Fort » incohérent ; niche palettes trop étroite |
| QuotaFort.com | « Fort » incohérent en vente |
| QuotaHarbor.com | Meilleur du lot « Quota » mais acheteurs SaaS peu profonds |
| RehabFort.com | « Fort » incohérent en santé |
| RehabRail.com | « Rail » sans lien métier |
| RenewFort.com | « Renew » trop générique sans contexte |
| ThreatRail.com | « Rail » sans lien métier en cyber |
| WattAnchor.com | « Anchor » faible ; 10 car. mais aucune demande prouvée |
| WattFort.com | « Fort » ; racine inutilisée nulle part |
| AmpRoster.com | « Roster » = niche RH étroite, incohérent avec « Amp » |
| SolarRoster.com | Idem « Roster » ; croisement solaire/planning trop spécifique |
| DockSprout.com | « Sprout » enfantin pour de la logistique B2B |
| FreightKiln.com | « Kiln » (four céramique) sans aucun rapport avec le fret |

### Les 535 autres candidats testés

Tous **déjà enregistrés** (RDAP HTTP 200) — dont la totalité des motifs commerciaux
exacts à forte valeur : `FreightAudit`, `SolarLoans`, `SolarLease`, `VendorRisk`,
`CyberAudit`, `LLMOps`, `ModelRisk`, `SpendOps`, `InvoiceOps`, `FleetOps`, `RouteOps`,
`PermitFlow`, `SolarQuotes`, `HeatPumps`, `AgentMesh`, `ContextStack`, `PromptForge`,
`LedgerForge`, `PayHarbor`, `CargoForge`… Ce résultat est en soi l'information la plus
utile du rapport : **il n'y a plus de terme métier .com exact disponible en hand-reg.**

---

## 5. LIMITES DE VÉRIFICATION DE CE RAPPORT

Conformément au §8.2, voici ce qui n'a **pas** pu être vérifié aujourd'hui :

| Donnée | Statut | Impact sur le scoring |
|---|---|---|
| Snapshots Wayback (§5.2) | **NON VÉRIFIÉ** — bloqué par la politique réseau (403), en `curl` et en fetch. Memento et archive.ph également bloqués | −2 pts sur C3 pour chaque finaliste |
| Ahrefs DR / Majestic TF / Moz DA (§5.3) | **INDISPONIBLE** — aucun connecteur. Substitué par la certitude structurelle (domaine neuf = 0 backlink) | C4 = 0/15, certain |
| Ventes comparables NameBio (§5.6) | **NON VÉRIFIÉ** — anti-bot (403 + `/relax`). Seules les données macro sont disponibles | −3 pts sur C2 |
| USPTO TESS / EUIPO / OMPIC / INPI (§5.5) | **PARTIEL** — API inaccessibles ; recherche web uniquement, aucune marque trouvée | −2 pts sur C6 |
| Volume de recherche / CPC (§5.8) | **NON VÉRIFIÉ** — pas d'accès Keyword Planner ni Ubersuggest | Inclus dans C1 |
| Prix 2e registrar (§5.1) | **PARTIEL** — Porkbun vérifié par API officielle ; Namecheap/Cloudflare/Dynadot bloqués. GoDaddy confirme la disponibilité mais ne renvoie pas de prix | Non pénalisant : tarif .com structurellement non-premium |

**Ce qui a été solidement vérifié :** disponibilité (RDAP Verisign **+** connecteur GoDaddy,
double source), prix .com (API Porkbun officielle, deux relevés horodatés), absence
d'historique (urlscan.io sur les 62), absence d'usage multi-TLD (`dig NS` sur 6 extensions).

---

## 6. CE QUE JE FERAIS À VOTRE PLACE

Vos 50 $ ne sont pas le facteur limitant — **l'accès aux données l'est**. Dépenser
11 $ aujourd'hui sur un nom à 48/100 revient à acheter un billet de loterie à
1 chance sur 800 sur votre fenêtre de 90 jours.

**Protocole pour reprendre la décision correctement (coût : 0 $)**

1. **Débloquer les 3 sources manquantes**, dans cet ordre de rendement :
   `web.archive.org` (historique) → `namebio.com` (comps) → un essai Ahrefs/Majestic (backlinks).
   Ce sont elles qui portent 30 des 100 points, et elles seules ouvrent la voie aux
   domaines expirés — le seul segment où un score de 82+ est atteignable.
2. **Sur ExpiredDomains.net**, section *Deleted Domains* : filtrer .com, ≤ 12 car.,
   sans tiret/chiffre, BL ≥ 20, Domain Pop ≥ 10, TF ≥ 10, âge Archive ≥ 5 ans.
   (La table est servie derrière du JavaScript ; l'export CSV du compte gratuit est la
   voie praticable.)
3. **Sur chaque candidat**, appliquer dans l'ordre : Wayback → urlscan → Majestic TF/CF
   → Google `site:` → USPTO. Un seul épisode toxique = rejet immédiat.
4. **Ne rien acheter tant qu'un candidat n'atteint pas 82.** Votre contrainte n'est pas
   le prix d'entrée, c'est le fait qu'il ne vous reste qu'un seul tir.

**Si vous devez impérativement engager les 50 $ malgré tout**, le moins mauvais choix
est **RehabClaims.com (11,08 $ chez Porkbun)** : c'est le seul dont l'expression décrit
un métier réel, avec des acheteurs nommés et un marché chiffré (3,7 Md$ de pertes
annuelles). Mais je le répète clairement : **c'est un 48/100, pas une recommandation**,
et son délai réaliste de revente est de 12 à 36 mois, pas de 30 à 90 jours.

### Benchmark FrostyData.com

Le brief exige que le domaine recommandé batte FrostyData.com sur au moins un axe.
Aucun des 62 candidats ne le bat sur un axe démontrable **avec des données vérifiées** :
tous partagent le même profil structurel (0 backlink, 0 usage, STR ~0,5 %/an) et aucun
n'atteint le seuil de 82. La condition de recommandation n'est donc pas remplie.

---

*Rapport produit le 28/08/2026. Disponibilités re-vérifiées à 11:03:10 UTC — elles
peuvent changer en quelques minutes ; toute décision exige une nouvelle vérification RDAP.*
