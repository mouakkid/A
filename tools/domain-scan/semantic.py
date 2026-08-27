# -*- coding: utf-8 -*-
"""Reject structural noise. Keep only compounds whose two halves genuinely
function as B2B product-name components in real-world naming practice."""
import json

# heads that actually appear as suffixes in real funded-company names
GOOD_HEADS = set("""grid rail rails layer stack core base works forge foundry vault ledger
desk bench board lens scope signal pulse trace track flow stream route path lane gate guard
watch shield proof seal anchor beacon bridge span mesh fabric thread loop engine kernel
port dock yard depot register record docket brief folio index chart map graph meter gauge
sensor radar relay switch circuit spine channel conduit frame studio compass atlas""".split())

# leads that actually carry sector meaning
GOOD_LEADS = set("""pay ledger settle clear invoice payout escrow treasury yield vault mint
credit audit policy control consent record register filing charter guard shield sentry warden
proof verify trust seal token badge passport claim signal metric trace probe lens gauge index
cohort schema dataset build deploy runtime registry pipeline commit branch merge patch release
model agent context prompt vector corpus reason route dispatch queue relay trigger approve
assign schedule cadence carbon solar grid volt turbine thermal ember renew emission freight
cargo fleet depot pallet manifest transit warehouse haul clinic triage intake chart referral
vitals payer studio canvas render reel swift clear solid steady level prime crisp clean
bright sharp north open ship shift forge sync scale span trace track scan sort rank tier gate
steer pilot chart plot draft frame craft weave bind link join merge fuse pair match align
anchor dock launch lift drive surge flow stream feed fuel spark""".split())

rows=[json.loads(l) for l in open("scored.jsonl")]
keep=[]
for r in rows:
    if r["words"]!=2: continue
    a,b=r["parts"]
    if r["src"]=="compound":
        if a in GOOD_LEADS and b in GOOD_HEADS: keep.append(r)
    else:  # compound_rev: parts are [head, lead] -> name = head+lead
        if a in GOOD_LEADS and b in GOOD_HEADS: keep.append(r)

keep.sort(key=lambda x:(-x["pre"]))
print(f"semantically coherent + AVAILABLE: {len(keep)}\n")
for r in keep:
    print(f"  {r['n']+'.com':22s} {r['pre']:5.1f}  {r['sector']:9s} [{'+'.join(r['parts'])}]")
