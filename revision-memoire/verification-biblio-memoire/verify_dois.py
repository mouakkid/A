#!/usr/bin/env python3
"""Vérifie chaque DOI de la bibliographie du mémoire EL HASSOUNY via Crossref.
Compare le nom du premier auteur et l'année. Sorties : dois_verifies.json + rapport."""
import json, re, time, urllib.request, pathlib, datetime
md = pathlib.Path('../manuscrit/manuscrit-corrige.md').read_text()
biblio = md.split('# **Bibliographie**')[1].split('# **Annexes**')[0]
entries = [l.strip() for l in biblio.split('\n') if l.strip() and not l.startswith('#')]
def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "memoir-doi-check/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r: return json.load(r)
out, sans_doi = [], []
for e in entries:
    m = re.search(r'https://doi\.org/(\S+?)\.?$', e)
    first_author = e.split(',')[0].replace('\\', '')
    year_m = re.search(r'\((\d{4})[a-z]?\)', e)
    year = int(year_m.group(1)) if year_m else None
    if not m:
        sans_doi.append(e[:110]); continue
    doi = m.group(1)
    try:
        r = get(f"https://api.crossref.org/works/{urllib.parse.quote(doi) if hasattr(urllib,'parse') else doi}")
        msg = r['message']
        cy = (msg.get('issued', {}).get('date-parts') or [[None]])[0][0]
        fam = (msg.get('author') or [{}])[0].get('family', '')
        t = (msg.get('title') or [''])[0]
        ok_auth = fam.lower()[:6] in first_author.lower() if fam else True
        ok_year = (cy is not None and year is not None and abs(cy - year) <= 2)
        verdict = "VÉRIFIÉ" if ok_auth else "ÉCART AUTEUR"
        if not ok_year: verdict += f" (année Crossref {cy} vs {year})"
        out.append({"entree": e[:100], "doi": doi, "verdict": verdict, "titre_crossref": t[:90], "annee_crossref": cy})
        print(f"{verdict:28s} {doi}")
    except Exception as ex:
        out.append({"entree": e[:100], "doi": doi, "verdict": f"ECHEC ({ex})"})
        print(f"ECHEC {doi}: {ex}")
    time.sleep(1.0)
import urllib.parse
pathlib.Path('dois_verifies.json').write_text(json.dumps(
  {"date": datetime.date.today().isoformat(), "avec_doi": out, "sans_doi": sans_doi}, ensure_ascii=False, indent=1))
print(f"\n{len(out)} DOI contrôlés, {len(sans_doi)} notices sans DOI (ouvrages, sources institutionnelles)")
for s in sans_doi: print("  SANS DOI:", s[:100])
