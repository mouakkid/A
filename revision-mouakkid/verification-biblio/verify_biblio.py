#!/usr/bin/env python3
"""Vérification Crossref des références de la bibliographie du mémoire
« Travail de memoire de Anass Mouakkid » (p. 129-134).
Pour chaque article de revue : recherche Crossref par titre + auteur,
comparaison année/revue/volume/pages, verdict. Les ouvrages, rapports et
actes sont listés séparément (vérification Crossref souvent non pertinente).
Sorties : biblio_verifiee.json + rapport console. Rien n'est inventé :
tout verdict découle de la réponse API archivée.
"""
import json, time, urllib.request, urllib.parse, pathlib, datetime, difflib

BASE = pathlib.Path(__file__).parent
RAW = BASE / "raw"
RAW.mkdir(exist_ok=True)

ARTICLES = [
 ("adebanjo2022", "Adebanjo", 2022, "Supply chain management in African organizations Review and Research Agenda", "African Journal of Economic and Management Studies", "13", "217-235"),
 ("carbonneau2008", "Carbonneau", 2008, "Application of machine learning techniques for supply chain demand forecasting", "European Journal of Operational Research", "184", "1140-1154"),
 ("chigwedere2024", "Chigwedere", 2024, "Digital transformation of supply chains in emerging markets challenges capabilities and impact", "Supply Chain Management An International Journal", "30", "287-305"),
 ("chopra2004", "Chopra", 2004, "Managing risk to avoid supply chain breakdown", "MIT Sloan Management Review", "46", "53-61"),
 ("christopherpeck2004", "Christopher", 2004, "Building the resilient supply chain", "International Journal of Logistics Management", "15", "1-13"),
 ("eppler2004", "Eppler", 2004, "The concept of information overload a review of literature", "The Information Society", "20", "325-344"),
 ("feng2022", "Feng", 2022, "Machine learning in operations management", "Manufacturing & Service Operations Management", "24", "1-13"),
 ("graves2000", "Graves", 2000, "Optimizing strategic safety stock placement in supply chains", "Manufacturing & Service Operations Management", "2", "68-83"),
 ("gunasekaran2017", "Gunasekaran", 2017, "Big data and predictive analytics for supply chain and organizational performance", "Journal of Business Research", "70", "308-317"),
 ("hochreiter1997", "Hochreiter", 1997, "Long short-term memory", "Neural Computation", "9", "1735-1780"),
 ("hohenstein2015", "Hohenstein", 2015, "Research on the phenomenon of supply chain resilience a systematic review", "International Journal of Physical Distribution & Logistics Management", "45", "90-117"),
 ("ivanov2022", "Ivanov", 2022, "Viable supply chain model integrating agility resilience and sustainability perspectives", "Annals of Operations Research", "319", "1411-1431"),
 ("ivanovdolgui2020", "Ivanov", 2020, "Viability of intertwined supply networks extending the supply chain resilience angles towards survivability", "International Journal of Production Research", "58", "2904-2915"),
 ("ivanovdolgui2023", "Ivanov", 2023, "Viable supply chain model integrating agility resilience and sustainability perspectives lessons from SARS-CoV-2 pandemic", "Annals of Operations Research", "319", "1411-1431"),
 ("ivanov2019", "Ivanov", 2019, "The impact of digital technology and Industry 4.0 on the ripple effect and supply chain risk analytics", "International Journal of Production Research", "57", "829-846"),
 ("juttner2011", "Juttner", 2011, "Supply chain resilience in the global financial crisis an empirical study", "Supply Chain Management An International Journal", "16", "246-259"),
 ("lecun2015", "LeCun", 2015, "Deep learning", "Nature", "521", "436-444"),
 ("lee2004", "Lee", 2004, "The triple-A supply chain", "Harvard Business Review", "82", "102-112"),
 ("lee1997", "Lee", 1997, "Information distortion in a supply chain the bullwhip effect", "Management Science", "43", "546-558"),
 ("makridakis2018", "Makridakis", 2018, "Statistical and machine learning forecasting methods Concerns and ways forward", "PLOS ONE", "13", "e0194889"),
 ("miclo2015", "Miclo", 2015, "Demand-driven MRP assessment of implementation in an industrial context", "Production Planning & Control", "26", "1225-1244"),
 ("nyaoga2020", "Nyaoga", 2020, "Supply chain performance measurement The FMCG Sector Perspective in Developing Countries", "Journal of Supply Chain and Customer Relationship Management", "2020", "1-13"),
 ("peck2005", "Peck", 2005, "Drivers of supply chain vulnerability an integrated framework", "International Journal of Physical Distribution & Logistics Management", "35", "210-232"),
 ("ponomarov2009", "Ponomarov", 2009, "Understanding the concept of supply chain resilience", "International Journal of Logistics Management", "20", "124-143"),
 ("sodhi2012", "Sodhi", 2012, "Researchers perspectives on supply chain risk management", "Production and Operations Management", "21", "1-13"),
 ("tang2006", "Tang", 2006, "Perspectives in supply chain risk management", "International Journal of Production Economics", "103", "451-488"),
 ("tukamuhabwa2015", "Tukamuhabwa", 2015, "Supply chain resilience definition review and theoretical foundations for further study", "International Journal of Production Research", "53", "5592-5623"),
 ("venkatesh2003", "Venkatesh", 2003, "User acceptance of information technology Toward a unified view", "MIS Quarterly", "27", "425-478"),
 ("wamba2015", "Wamba", 2015, "How big data can make big impact Findings from a systematic review and a longitudinal case study", "International Journal of Production Economics", "165", "234-246"),
 ("wanghajli2022", "Wang", 2022, "Exploring the path to big data analytics success in supply chain management a configurational approach", "International Journal of Operations & Production Management", "42", "873-898"),
]

NON_ARTICLES = [
 ("berger1966", "ouvrage", "Berger & Luckmann (1966), The social construction of reality, Doubleday"),
 ("christopher2016", "ouvrage", "Christopher (2016), Logistics and Supply Chain Management, 5e éd., Pearson"),
 ("davenport2016", "ouvrage", "Davenport & Kirby (2016), Only humans need apply, HarperBusiness"),
 ("glaser1967", "ouvrage", "Glaser & Strauss (1967), The discovery of grounded theory, Aldine"),
 ("goldratt1992", "ouvrage", "Goldratt & Cox (1992), The Goal, 2e éd., North River Press"),
 ("goodfellow2016", "ouvrage", "Goodfellow, Bengio & Courville (2016), Deep learning, MIT Press"),
 ("perrow1984", "ouvrage", "Perrow (1984), Normal accidents, Basic Books"),
 ("ptak2016", "ouvrage", "Ptak & Smith (2016), Demand driven material requirements planning, Industrial Press"),
 ("rogers2003", "ouvrage", "Rogers (2003), Diffusion of innovations, 5e éd., Free Press"),
 ("sheffi2005", "ouvrage", "Sheffi (2005), The resilient enterprise, MIT Press"),
 ("strauss1998", "ouvrage", "Strauss & Corbin (1998), Basics of qualitative research, 2e éd., SAGE"),
 ("mckinsey2024", "rapport", "McKinsey & Company (2024), Generative AI and the future of supply chain operations"),
 ("smithptak2011", "acte", "Smith & Ptak (2011), Exactly right..., APICS International Conference"),
]

def get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "memoir-biblio-check/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)

def sim(a, b):
    return difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio()

results = []
for key, author, year, title, journal, vol, pages in ARTICLES:
    params = {"query.bibliographic": title, "query.author": author, "rows": "5",
              "select": "DOI,title,container-title,issued,author,volume,issue,page"}
    url = "https://api.crossref.org/works?" + urllib.parse.urlencode(params)
    try:
        d = get(url)
    except Exception as e:
        results.append({"cle": key, "verdict": "ERREUR API", "detail": str(e)})
        time.sleep(2); continue
    (RAW / f"{key}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1))
    best, best_score = None, 0.0
    for it in d["message"]["items"]:
        t = (it.get("title") or [""])[0]
        s = sim(title, t)
        if s > best_score:
            best, best_score = it, s
    if not best or best_score < 0.55:
        results.append({"cle": key, "verdict": "INTROUVABLE (score max %.2f)" % best_score})
    else:
        by = (best.get("issued", {}).get("date-parts") or [[None]])[0][0]
        bj = (best.get("container-title") or [""])[0]
        bv, bp = best.get("volume"), best.get("page")
        issues = []
        if by and abs(int(by) - year) > 0: issues.append(f"année: biblio {year} vs Crossref {by}")
        if journal and bj and sim(journal, bj) < 0.55: issues.append(f"revue: biblio « {journal} » vs Crossref « {bj} »")
        if vol and bv and vol != bv: issues.append(f"volume: biblio {vol} vs Crossref {bv}")
        if pages and bp and pages.replace('-', '–') != bp.replace('-', '–') and pages != bp: issues.append(f"pages: biblio {pages} vs Crossref {bp}")
        verdict = "VÉRIFIÉE" if not issues else "ÉCARTS: " + " | ".join(issues)
        results.append({"cle": key, "verdict": verdict, "titre_crossref": (best.get("title") or [""])[0],
                        "score_titre": round(best_score, 2), "doi": best.get("DOI"),
                        "annee_cr": by, "revue_cr": bj, "vol_cr": bv, "pages_cr": bp})
    time.sleep(1.1)

out = {"date": datetime.date.today().isoformat(), "articles": results,
       "non_articles": [{"cle": k, "type": t, "notice": n, "verdict": "à vérifier hors Crossref (ouvrage/rapport/acte)"} for k, t, n in NON_ARTICLES]}
(BASE / "biblio_verifiee.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
for r in results:
    print(f"[{r['cle']:20s}] {r['verdict']}")
    if 'doi' in r: print(f"  ↳ {r.get('titre_crossref','')[:80]} | {r.get('revue_cr','')[:40]} | {r.get('annee_cr')} | vol {r.get('vol_cr')} | pp {r.get('pages_cr')} | doi:{r.get('doi')}")
print(f"\n{len(results)} articles contrôlés; {len(NON_ARTICLES)} ouvrages/rapports/actes à vérifier séparément")
