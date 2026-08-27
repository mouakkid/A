# -*- coding: utf-8 -*-
"""Programmatic pre-scoring of RDAP-confirmed-available names.
Deliberately scores only what is COMPUTABLE (structure, linguistics, sector fit,
word familiarity). Buyer depth, trademark risk, history and comps are decided by
human review afterwards -- raw metrics must not dominate the ranking."""
import json, re
from collections import defaultdict

VOWELS = set("aeiouy")

# Tier 1 = everyday, high-recognition business vocabulary (best resale liquidity).
TIER1 = set("""pay ledger settle clear invoice payout escrow treasury yield vault mint credit
audit policy control consent record register filing charter
guard shield sentry warden bastion citadel keystone sentinel
proof verify trust seal token badge passport claim
signal metric trace probe lens gauge index cohort schema dataset
build deploy runtime registry pipeline commit branch merge patch release
model agent context prompt vector corpus reason
route dispatch queue relay trigger approve assign schedule cadence
carbon solar grid volt turbine thermal ember renew emission
freight cargo fleet depot pallet manifest transit warehouse dispatch haul
clinic triage intake chart referral vitals payer
studio canvas render reel palette
swift brisk keen clear plain solid sound steady level true prime crisp clean bright sharp quiet calm north first open
ship shift forge cast tune trim sync scale span trace track scan sift sort rank tier gate steer pilot chart plot
draft frame craft weave bind link join merge fuse pair match align ground anchor moor dock launch lift raise boost
drive surge flow stream feed fuel spark kindle beam
rail rails works foundry engine core stack base mesh fabric kernel beacon harbor port dock
arc atlas compass helm bridge span tower gate keep layer channel spine frame pillar
watch lantern lookout vigil patrol
radar sonar meter dial graph map survey sensor scope prism
current tide wave drift lane path trail orbit circuit switch loop thread braid
desk bench board panel roster docket folio brief dossier almanac codex
haven yard bay cove ridge summit crest peak basin delta cape reach landing quay wharf
kiln mill press anvil loom workshop
flare torch amp dynamo reactor""".split())

# sector desirability for 2026 end-user demand (per the brief's trend list)
SECTOR_W = {"ai":1.00,"cyber":0.97,"identity":0.96,"fintech":0.95,"regtech":0.94,
            "data":0.93,"devtools":0.92,"privacy":0.92,"workflow":0.88,"health":0.88,
            "climate":0.86,"logistics":0.85,"robotics":0.84,"spatial":0.78,
            "creator":0.76,"quality":0.72,"action":0.72,"general":0.60}

def syl(w):
    n=0; prev=False
    for ch in w:
        v=ch in VOWELS
        if v and not prev: n+=1
        prev=v
    if w.endswith("e") and n>1: n-=1
    return max(1,n)

def pronounce(s):
    """0-1: penalise consonant clusters and vowel pileups."""
    worst=0; run=0
    for ch in s:
        if ch not in VOWELS: run+=1; worst=max(worst,run)
        else: run=0
    p=1.0
    if worst>=4: p-=0.45
    elif worst==3: p-=0.15
    if re.search(r"[aeiou]{3}",s): p-=0.25
    v=sum(1 for c in s if c in VOWELS)/len(s)
    if v<0.30 or v>0.55: p-=0.15
    return max(0.0,p)

def length_score(n):
    L=len(n)
    if 5<=L<=8: return 1.0
    if L==9: return 0.90
    if L==4: return 0.92
    if L==10: return 0.78
    if L==11: return 0.60
    if L==12: return 0.42
    return 0.2

def spellable(s):
    """Can it be written correctly after hearing it once?"""
    bad=0
    if re.search(r"(ph|kn|wr|gh|ough|augh)",s): bad+=1     # ambiguous graphemes
    if re.search(r"(ei|ie)",s): bad+=0.5
    if re.search(r"[csz]{2}",s): bad+=1
    if re.search(r"(x|q|j|z)",s): bad+=0.4
    return max(0.0,1.0-0.35*bad)

avail={l.split("\t")[0] for l in open("rdap_results.tsv") if l.rstrip().endswith("\tAVAIL")}
meta={}
for l in open("candidates.jsonl"):
    r=json.loads(l); meta[r["n"]]=r

out=[]
for n in avail:
    r=meta.get(n)
    if not r: continue
    parts=r["parts"]
    fam=sum(1 for p in parts if p in TIER1)/len(parts)      # word familiarity 0-1
    s=0.0
    s += 26*length_score(n)                                  # structure
    s += 16*pronounce(n)
    s += 12*spellable(n)
    s += 22*fam                                              # everyday-vocabulary weight
    s += 18*SECTOR_W.get(r["sector"],0.6)                    # trend/sector relevance
    sy=syl(n)
    s += 6 if sy in (2,3) else (2 if sy==4 else 0)
    if r["src"]=="brandable": s -= 14                        # invented => far thinner liquidity
    if r["src"]=="single":    s += 4
    if r["src"]=="compound_rev": s -= 2
    out.append({**r,"pre":round(s,2),"fam":round(fam,2),"pron":round(pronounce(n),2)})

out.sort(key=lambda x:-x["pre"])
with open("scored.jsonl","w") as f:
    for r in out: f.write(json.dumps(r)+"\n")

print(f"available names scored: {len(out)}")
print(f"pre-score >=70: {sum(1 for r in out if r['pre']>=70)}")
print(f"pre-score >=75: {sum(1 for r in out if r['pre']>=75)}")
print(f"pre-score >=80: {sum(1 for r in out if r['pre']>=80)}")
