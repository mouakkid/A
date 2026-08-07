#!/usr/bin/env python3
"""Première passe d'exécution du protocole documentaire (document 03).
Bases ouvertes : Crossref (recherche + vérification) et Semantic Scholar.
Chaque requête est consignée (URL exacte, horodatage, nombre de résultats)
dans queries_log.json ; les réponses brutes sont conservées dans raw/.
"""
import json, time, urllib.request, urllib.parse, pathlib, datetime

BASE = pathlib.Path(__file__).parent
RAW = BASE / "raw"
RAW.mkdir(exist_ok=True)

WINDOW = ("2023-01-01", "2026-08-07")

AXES = {
    "A1": ("Adoption de l'IA en GRH (TAM/UTAUT)",
           "artificial intelligence adoption human resource management acceptance UTAUT TAM",
           "artificial intelligence adoption human resource management technology acceptance"),
    "A2": ("IA générative et RH",
           "generative artificial intelligence ChatGPT human resource management recruitment",
           "generative AI large language models human resources HR"),
    "A3": ("Algorithmic HRM / people analytics",
           "algorithmic management people analytics HR analytics employees",
           "algorithmic human resource management workers"),
    "A4": ("Confiance, transparence, explicabilité",
           "trust transparency explainable artificial intelligence hiring recruitment decisions",
           "algorithm aversion trust AI managerial decisions"),
    "A5": ("Remplacement perçu, insécurité d'emploi",
           "artificial intelligence job insecurity fear replacement employees",
           "AI anxiety technological unemployment perception workers"),
    "A6": ("Contextes émergents, Afrique du Nord, Maroc",
           "artificial intelligence human resource management Morocco North Africa",
           "digital HRM emerging economies developing countries adoption"),
    "A7": ("Éthique, biais, équité du recrutement algorithmique",
           "algorithmic bias fairness recruitment hiring discrimination artificial intelligence",
           "ethics AI personnel selection hiring bias"),
}

LOG = []

def get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "memoir-lit-review/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)

def crossref_search(axis, variant_idx, query):
    params = {
        "query.bibliographic": query,
        "filter": f"from-pub-date:{WINDOW[0]},until-pub-date:{WINDOW[1]},type:journal-article",
        "rows": "25",
        "select": "DOI,title,container-title,issued,author,is-referenced-by-count,abstract,type",
    }
    url = "https://api.crossref.org/works?" + urllib.parse.urlencode(params)
    d = get(url)
    out = RAW / f"crossref_{axis}_q{variant_idx}.json"
    out.write_text(json.dumps(d, ensure_ascii=False, indent=1))
    LOG.append({"date": datetime.datetime.utcnow().isoformat() + "Z", "base": "Crossref REST API",
                "axe": axis, "url": url, "n_total": d["message"]["total-results"],
                "n_exportes": len(d["message"]["items"]), "fichier": out.name})
    return d["message"]["items"]

def s2_search(axis, query):
    params = {"query": query, "limit": "25",
              "fields": "title,abstract,year,venue,externalIds,citationCount,publicationTypes",
              "year": "2023-2026"}
    url = "https://api.semanticscholar.org/graph/v1/paper/search?" + urllib.parse.urlencode(params)
    for attempt in range(5):
        try:
            d = get(url)
            break
        except Exception as e:
            if attempt == 4:
                LOG.append({"date": datetime.datetime.utcnow().isoformat() + "Z",
                            "base": "Semantic Scholar", "axe": axis, "url": url,
                            "n_total": None, "n_exportes": 0, "erreur": str(e)})
                return []
            time.sleep(3 * (attempt + 1))
    out = RAW / f"s2_{axis}.json"
    out.write_text(json.dumps(d, ensure_ascii=False, indent=1))
    LOG.append({"date": datetime.datetime.utcnow().isoformat() + "Z", "base": "Semantic Scholar Graph API",
                "axe": axis, "url": url, "n_total": d.get("total"),
                "n_exportes": len(d.get("data", [])), "fichier": out.name})
    return d.get("data", [])

def norm_doi(doi):
    return doi.lower().removeprefix("https://doi.org/") if doi else None

candidates = {}
for axis, (label, q1, q2) in AXES.items():
    seen = {}
    for i, q in enumerate([q1, q2], 1):
        try:
            items = crossref_search(axis, i, q)
        except Exception as e:
            LOG.append({"date": datetime.datetime.utcnow().isoformat() + "Z", "base": "Crossref REST API",
                        "axe": axis, "requete": q, "erreur": str(e)})
            items = []
        for it in items:
            doi = norm_doi(it.get("DOI"))
            if doi and doi not in seen:
                year = (it.get("issued", {}).get("date-parts") or [[None]])[0][0]
                seen[doi] = {"doi": doi, "titre": (it.get("title") or [""])[0],
                             "revue": (it.get("container-title") or [""])[0],
                             "annee": year, "citations": it.get("is-referenced-by-count", 0),
                             "resume": bool(it.get("abstract")),
                             "auteurs": [f"{a.get('family','?')}, {a.get('given','?')[:1]}." for a in (it.get("author") or [])[:25]],
                             "source": "crossref"}
        time.sleep(1.2)
    for it in s2_search(axis, q1):
        doi = norm_doi((it.get("externalIds") or {}).get("DOI"))
        if doi and doi not in seen and it.get("year") and it["year"] >= 2023:
            seen[doi] = {"doi": doi, "titre": it.get("title", ""), "revue": it.get("venue", ""),
                         "annee": it.get("year"), "citations": it.get("citationCount", 0),
                         "resume": bool(it.get("abstract")), "auteurs": [], "source": "s2"}
    time.sleep(1.5)
    candidates[axis] = {"label": label, "items": sorted(seen.values(), key=lambda x: -(x["citations"] or 0))}

(BASE / "queries_log.json").write_text(json.dumps(LOG, ensure_ascii=False, indent=1))
(BASE / "candidates.json").write_text(json.dumps(candidates, ensure_ascii=False, indent=1))

for axis, blob in candidates.items():
    print(f"\n=== {axis} — {blob['label']} — {len(blob['items'])} candidats dédoublonnés ===")
    for j, it in enumerate(blob["items"][:18]):
        print(f"[{axis}:{j}] {it['annee']} | cit:{it['citations']:>4} | {it['titre'][:95]} | {it['revue'][:45]} | {it['doi']}")
print("\nLog:", len(LOG), "requêtes consignées")
