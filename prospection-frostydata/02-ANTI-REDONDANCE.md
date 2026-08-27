# Contrôle anti-redondance — comparaison avec vos envois précédents

Analyse de la boîte `anass.mouakkid@gmail.com` (messages envoyés + brouillons en attente), 27/08/2026.

---

## 1. Portefeuille déjà démarché

| Domaine | Période | Volume observé | Secteurs ciblés |
|---|---|---|---|
| `VG90.com` | juil. 2026 + relance août | ~25 envois | Retro gaming, musées, éditeurs, expos |
| `FootScoop.com` | mai + août 2026 | ~10 envois | Médias football / transferts |
| `VeggieMealPlans.com` | août 2026 | ~15 envois + 9 brouillons | Meal plans, santé végétale |
| `ChefChocolatier.com` | août 2026 | ~8 envois + 7 brouillons | Écoles, couverture, presse B2B |
| `ShopFromLondon.com` | août 2026 | ~3 envois + 7 brouillons | Antiquaires, shopping touristique |
| `FeelWheels.com` | août 2026 | ~7 envois | Fauteuils roulants, jantes auto |
| `nfr7.com` / `m9lb.com` | mai 2026 | 2 envois | Marques arabophones |
| `rca.ma` / `volvo.ma` | août 2026 | 3 envois | Transfert amiable (registre .ma) |

### ✅ Résultat n°1 : aucun chevauchement de destinataire

Les **9 contacts frostydata.com sont tous nouveaux**. Aucune adresse, aucun domaine d'entreprise, aucun
secteur n'a déjà été démarché. **Zéro risque de doublon de destinataire.**

---

## 2. ⚠️ Résultat n°2 : redondance de formulation (le vrai problème)

Vos ~60 emails partagent **le même squelette**, quasi mot pour mot :

```
Hi/Hello [X] team,
[Could you kindly pass this to …]
I own [DOMAIN].com. [Entreprise] does [activité] — this exact-match .com could serve as
[an SEO landing page / a memorable campaign URL / a clean redirect].
I'm offering it privately to a few [catégorie] before a public listing. Worth a look? / Interested?
Best regards,
Anass Mouakkid
```

### Formules réutilisées à l'identique dans presque tous les messages

| Formule | Occurrences observées |
|---|---|
| « I own [DOMAIN].com. » | quasi 100 % |
| « exact-match .com » | très fréquent |
| « a memorable campaign URL » / « campaign address » | très fréquent |
| « an SEO landing page » / « acquisition landing page » | très fréquent |
| « a clean redirect » / « redirect that protects » | fréquent |
| **« I'm offering it privately to a few X before a public listing »** | **quasi 100 %** |
| « Worth a look? » / « Interested? » | quasi 100 % |
| Objet `DOMAIN.com for COMPANY` ou `DOMAIN.com — descriptif` | 100 % |
| Signature = 2 lignes nues, sans téléphone ni fonction | 100 % |

### Pourquoi c'est coûteux

1. **Filtrage anti-spam.** Gmail et les passerelles d'entreprise détectent la similarité entre messages
   d'un même expéditeur. Un gabarit répété sur des dizaines d'envois dégrade progressivement la
   réputation de la boîte — vos futurs emails partent en Promotions ou en spam **pour tous vos domaines**.
2. **Effet « publipostage ».** Un destinataire qui perçoit le gabarit répond moins : le message ne semble
   plus lui être adressé.
3. **Risque de crédibilité (le plus grave).** La ligne *« I'm offering it privately to a few X before a
   public listing »* est utilisée pour **6 domaines différents**. Deux problèmes :
   - elle est **invérifiable** et sonne comme une fausse rareté ;
   - pour `frostydata.com` elle serait **factuellement fausse** — le domaine est **déjà** listé
     publiquement sur Atom.com (nameservers `NS1/NS2.ATOM.COM` vérifiés). L'acheteur le constate en
     10 secondes, et vous perdez la vente **et** la confiance.

---

## 3. Décision : registre entièrement différent pour frostydata.com

Les 9 emails frostydata **n'empruntent aucune phrase** au corpus existant. Changement de stratégie
assumé, pas seulement de vocabulaire :

| Dimension | Vos emails actuels | Emails frostydata (nouveaux) |
|---|---|---|
| **Registre** | Pitch marketing (« ce que ça pourrait vous apporter ») | **Transactionnel** (« voici l'actif, le prix, les modalités ») |
| **Prix** | Jamais annoncé | **Annoncé dès la ligne 2** — filtre les curieux, supprime 3 allers-retours |
| **Escrow** | Jamais mentionné | **Cité dans le message 1** — signal anti-arnaque n°1 |
| **Rareté** | « privately… before a public listing » | **Inverse : transparence** — « c'est listé publiquement, ce n'est ni privé ni limité dans le temps » |
| **Faiblesses de l'actif** | Passées sous silence ; angle SEO implicite | **Divulguées d'emblée** : créé le 27/08/2026, zéro trafic, zéro backlink |
| **Modalités techniques** | Absentes | **Blocage ICANN 60 j expliqué** — évite la mauvaise surprise en closing |
| **Objet** | `DOMAIN.com for COMPANY` | Objet transactionnel, formulé différemment sur chaque envoi |
| **Signature** | 2 lignes nues | **Bloc complet** : fonction, téléphone, ville — crédibilité |
| **Désinscription** | Absente | **Ligne d'opt-out explicite** — conformité CAN-SPAM + respect |

### Le pari contre-intuitif : dire les défauts augmente la conversion

Annoncer « créé le 27/08/2026, aucun historique » semble contre-productif. En réalité :
l'acheteur le découvre **de toute façon** en 30 secondes (Wayback, Ahrefs, WHOIS). Le dire avant lui
transforme un piège en preuve d'honnêteté — et c'est précisément ce qui manque dans un marché où
l'acheteur suppose par défaut qu'il a affaire à un arnaqueur.

Sur un brandable, l'historique **n'a aucune valeur** de toute façon : vous ne perdez donc aucun argument
réel, et vous gagnez la crédibilité qui débloque la négociation.

---

## 4. À corriger aussi dans vos brouillons en attente (hors frostydata)

Il reste **23 brouillons non envoyés** (VeggieMealPlans, ChefChocolatier, ShopFromLondon) qui utilisent
tous la ligne « offering it privately … before a public listing ».

**Recommandation :** avant de les envoyer, remplacez cette phrase — au minimum en variant la formulation,
idéalement en la supprimant si le domaine concerné est, lui aussi, déjà listé publiquement quelque part.
C'est la seule phrase de votre corpus qui présente un risque de crédibilité réel.

> Je n'ai **pas** modifié ces brouillons : ils concernent d'autres domaines et vous ne me l'avez pas
> demandé. Dites-le moi si vous voulez que je les réécrive.
