# -*- coding: utf-8 -*-
"""Quality-first generation. A 'container' head noun (Desk, Layer, Ledger, Vault...)
combines meaningfully with almost ANY sector noun -- unlike arbitrary word pairs.
This is how real B2B products are actually named."""
import itertools, re, json

SECTOR_NOUNS = {
"regtech": ["policy","audit","control","consent","evidence","clause","filing","charter",
            "comply","attest","mandate","statute","disclosure","covenant","record"],
"risk":    ["risk","incident","vendor","threat","exposure","breach","posture","assurance"],
"identity":["identity","credential","access","secret","key","token","proof","trust","badge",
            "passport","session","tenant"],
"ai":      ["model","prompt","context","agent","eval","inference","corpus","vector","embed",
            "weights","tensor","reasoning","guardrail"],
"data":    ["signal","metric","trace","schema","lineage","cohort","dataset","telemetry",
            "column","pipeline","warehouse","catalog"],
"devtools":["build","deploy","release","artifact","patch","commit","runtime","rollout",
            "staging","registry","package","binary"],
"fintech": ["pay","payout","settle","escrow","treasury","invoice","ledger","remit",
            "reconcile","payment","billing","revenue","clearing"],
"climate": ["carbon","watt","solar","ember","emission","renewable","thermal","turbine"],
"logistics":["freight","cargo","pallet","manifest","fleet","depot","route","shipment",
             "customs","lading","haulage"],
"health":  ["triage","intake","chart","referral","claims","payer","clinic","patient",
            "formulary","dosing"],
"privacy": ["consent","privacy","redact","retention","subject","erasure"],
"robotics":["payload","actuator","shopfloor","cobot","autonomy","kinematic"],
"creator": ["render","storyboard","cutlist","montage","caption","broll"],
}

# generic container nouns: pair coherently with essentially any sector noun
HEADS = ["desk","layer","grid","ledger","vault","rail","deck","board","log","trail",
         "works","forge","stack","base","bench","core","loop","gate","guard","watch",
         "lens","scope","signal","map","atlas","compass","anchor","beacon","bridge",
         "mesh","engine","frame","room","suite","yard","depot","docket","folio",
         "register","index","port","dock","path","lane","thread","kernel","fabric","panel"]

def ok(s):
    if not (5 <= len(s) <= 13): return False
    if re.search(r"(.)\1\1", s): return False
    return bool(re.fullmatch(r"[a-z]+", s))

def seam(a,b):
    if a==b: return False
    if a[-1]==b[0]: return False
    if b.startswith(a) or a.endswith(b): return False
    return True

out={}
for sector,nouns in SECTOR_NOUNS.items():
    for n,h in itertools.product(nouns,HEADS):
        if not seam(n,h): continue
        name=n+h
        if ok(name) and name not in out:
            out[name]={"n":name,"src":"container","sector":sector,"words":2,"parts":[n,h]}

with open("candidates2.jsonl","w") as f:
    for r in out.values(): f.write(json.dumps(r)+"\n")
print("gen2 candidates:",len(out))
