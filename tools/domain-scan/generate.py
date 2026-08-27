# -*- coding: utf-8 -*-
import itertools, re, json, random
from wordbank import LEADS, HEADS, SINGLE_WORDS, BR_ONSETS, BR_VOWELS, BR_CODAS, BR_TAILS
random.seed(20260827)

VOWELS = set("aeiouy")

# sector -> which head groups make commercial sense (relevance matrix)
AFFINITY = {
 "fintech":  ["infra","flow","office","signal","place"],
 "regtech":  ["office","infra","watch","signal"],
 "cyber":    ["watch","infra","signal","place"],
 "identity": ["watch","office","infra","signal"],
 "data":     ["signal","infra","flow","office"],
 "devtools": ["infra","craft","flow","office"],
 "ai":       ["infra","craft","signal","energy"],
 "workflow": ["flow","office","infra","signal"],
 "climate":  ["energy","infra","place","signal"],
 "logistics":["place","flow","infra","office"],
 "health":   ["office","signal","place","flow"],
 "robotics": ["craft","infra","signal","place"],
 "spatial":  ["signal","infra","craft"],
 "creator":  ["craft","flow","office","place"],
 "quality":  ["infra","place","craft","flow","signal","watch","office","energy"],
 "action":   ["infra","place","craft","flow","signal","watch","office","energy"],
}

def syllables(w):
    w = w.lower(); n = 0; prev = False
    for ch in w:
        v = ch in VOWELS
        if v and not prev: n += 1
        prev = v
    if w.endswith("e") and n > 1: n -= 1
    return max(1, n)

BAD_SUBSTR = re.compile(r"(.)\1\1|[bcdfghjklmnpqrstvwxz]{5}|q(?!u)|xx|zz|jj|vv|uu")
def wellformed(s):
    if BAD_SUBSTR.search(s): return False
    if not (4 <= len(s) <= 12): return False
    if not re.fullmatch(r"[a-z]+", s): return False
    # must have a reasonable vowel ratio
    v = sum(1 for c in s if c in VOWELS)
    if v < len(s) * 0.25 or v > len(s) * 0.62: return False
    return True

def seam_ok(a, b):
    if a == b: return False
    if a[-1] == b[0]: return False              # doubled seam letter -> muddy
    if a[-2:] == b[:2]: return False
    if b.startswith(a) or a.endswith(b): return False
    if a[-1] in "sz" and b[0] in "sz": return False
    return True

cands = {}   # name -> meta

# ---------------------------------------------------------- 1. compound generation
for sector, leads in LEADS.items():
    for hg in AFFINITY[sector]:
        for lead, head in itertools.product(leads, HEADS[hg]):
            if not seam_ok(lead, head): continue
            name = lead + head
            if not wellformed(name): continue
            if syllables(name) > 4: continue
            if name not in cands:
                cands[name] = {"n": name, "src": "compound", "sector": sector,
                               "hg": hg, "words": 2, "parts": [lead, head]}

# reversed order too (head+lead) where it reads naturally
for sector, leads in LEADS.items():
    for hg in AFFINITY[sector]:
        for lead, head in itertools.product(leads, HEADS[hg]):
            if not seam_ok(head, lead): continue
            name = head + lead
            if not wellformed(name): continue
            if syllables(name) > 4: continue
            if name not in cands:
                cands[name] = {"n": name, "src": "compound_rev", "sector": sector,
                               "hg": hg, "words": 2, "parts": [head, lead]}

# ---------------------------------------------------------- 2. strong single words
for w in SINGLE_WORDS:
    w = w.lower()
    if re.fullmatch(r"[a-z]+", w) and 4 <= len(w) <= 12:
        cands[w] = {"n": w, "src": "single", "sector": "general", "hg": "-",
                    "words": 1, "parts": [w]}

# ---------------------------------------------------------- 3. brandable inventions
seen_br = set()
for _ in range(60000):
    pat = random.choice(["OVCV","OVCVC","OVCCV","CVOVC","OVCVT"])
    s = ""
    for ch in pat:
        if ch == "O": s += random.choice(BR_ONSETS)
        elif ch == "V": s += random.choice(BR_VOWELS)
        elif ch == "C": s += random.choice(BR_CODAS)
        elif ch == "T": s += random.choice(BR_TAILS)
    if not (5 <= len(s) <= 9): continue
    if not wellformed(s): continue
    if syllables(s) not in (2, 3): continue
    if s in cands or s in seen_br: continue
    seen_br.add(s)
    cands[s] = {"n": s, "src": "brandable", "sector": "general", "hg": "-",
                "words": 1, "parts": [s]}
    if len(seen_br) >= 12000: break

rows = list(cands.values())
for r in rows:
    r["len"] = len(r["n"])
    r["syl"] = syllables(r["n"])

with open("candidates.jsonl", "w") as f:
    for r in rows:
        f.write(json.dumps(r) + "\n")

from collections import Counter
c = Counter(r["src"] for r in rows)
print("TOTAL CANDIDATES:", len(rows))
for k, v in c.most_common(): print(f"  {k:14s} {v}")
