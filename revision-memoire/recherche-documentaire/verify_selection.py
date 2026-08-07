#!/usr/bin/env python3
"""Vérification Crossref des références sélectionnées après tri qualitatif.
Pour chaque DOI : résolution via api.crossref.org/works/{doi}, capture des
métadonnées complètes (auteurs, titre, revue, volume, numéro, pages, année).
Sortie : selection_verifiee.json + échec éventuel signalé (jamais complété
par supposition).
"""
import json, time, urllib.request, urllib.parse, pathlib, datetime

BASE = pathlib.Path(__file__).parent

# (axe, tier, doi) — tier A = revue établie ; tier B = complément, qualité à évaluer
SELECTION = [
    ("A1", "A", "10.1007/s11301-023-00367-z"),
    ("A1", "A", "10.1016/j.hrmr.2022.100899"),
    ("A1", "A", "10.1016/j.hrmr.2022.100940"),
    ("A1", "A", "10.1080/09585192.2024.2440065"),
    ("A1", "B", "10.1080/09585192.2025.2510546"),
    ("A2", "A", "10.1111/1748-8583.12524"),
    ("A2", "A", "10.1111/1467-8551.12824"),
    ("A2", "A", "10.1002/hrdq.21551"),
    ("A2", "A", "10.1108/ijchm-01-2025-0159"),
    ("A2", "B", "10.1007/s44282-025-00175-8"),
    ("A3", "A", "10.1016/j.hrmr.2021.100876"),
    ("A3", "A", "10.1016/j.hrmr.2022.100925"),
    ("A3", "A", "10.1002/hrm.22168"),
    ("A3", "A", "10.1002/hrm.22268"),
    ("A3", "A", "10.1002/hrm.22263"),
    ("A3", "A", "10.1016/j.hrmr.2026.101135"),
    ("A3", "A", "10.5465/amd.2022.0091"),
    ("A4", "A", "10.1016/j.chbr.2023.100303"),
    ("A4", "A", "10.1007/s11846-024-00748-y"),
    ("A4", "A", "10.1057/s41599-025-05116-z"),
    ("A4", "B", "10.3389/frai.2025.1671997"),
    ("A4", "A", "10.1108/jkm-06-2025-0870"),
    ("A5", "A", "10.1007/s10869-024-09963-6"),
    ("A5", "A", "10.1016/j.jik.2024.100590"),
    ("A5", "A", "10.1016/j.actpsy.2025.104733"),
    ("A5", "A", "10.1108/ijchm-01-2024-0051"),
    ("A5", "A", "10.1016/j.techfore.2025.124326"),
    ("A5", "A", "10.1016/j.caeai.2024.100260"),
    ("A5", "B", "10.1080/00049530.2025.2559910"),
    ("A6", "B", "10.4102/sajhrm.v23i0.2960"),
    ("A6", "B", "10.4102/sajhrm.v24i0.3315"),
    ("A6", "B", "10.1186/s43093-025-00515-9"),
    ("A6", "B", "10.7190/fintaf.v2i1.413"),
    ("A6", "A", "10.1002/hrm.22313"),
    ("A7", "A", "10.1057/s41599-023-02079-x"),
    ("A7", "A", "10.3389/fpsyg.2023.1118723"),
    ("A7", "A", "10.1111/ijsa.12499"),
    ("A7", "A", "10.1177/00187267251403902"),
    ("A7", "B", "10.1007/s44282-025-00246-w"),
]

def get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": "memoir-lit-review/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)

out, failures = [], []
for axe, tier, doi in SELECTION:
    url = "https://api.crossref.org/works/" + urllib.parse.quote(doi)
    try:
        m = get(url)["message"]
        authors = [{"famille": a.get("family", ""), "prenom": a.get("given", "")}
                   for a in m.get("author", [])]
        year = (m.get("issued", {}).get("date-parts") or [[None]])[0][0]
        out.append({
            "axe": axe, "tier": tier, "doi": doi,
            "titre": (m.get("title") or [""])[0],
            "revue": (m.get("container-title") or [""])[0],
            "annee": year, "volume": m.get("volume"), "numero": m.get("issue"),
            "pages": m.get("page"), "type": m.get("type"),
            "citations_crossref": m.get("is-referenced-by-count"),
            "auteurs": authors,
            "verifie_le": datetime.date.today().isoformat(),
            "methode": "Crossref REST API (works/{doi})",
            "statut": "vérifiée (existence et métadonnées)",
        })
        print(f"OK  {doi}  {year}  {(m.get('title') or [''])[0][:70]}")
    except Exception as e:
        failures.append({"axe": axe, "doi": doi, "erreur": str(e)})
        print(f"FAIL {doi}: {e}")
    time.sleep(1.0)

(BASE / "selection_verifiee.json").write_text(json.dumps(
    {"date": datetime.date.today().isoformat(), "verifiees": out, "echecs": failures},
    ensure_ascii=False, indent=1))
print(f"\n{len(out)} vérifiées, {len(failures)} échecs")
