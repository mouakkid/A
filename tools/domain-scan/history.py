# -*- coding: utf-8 -*-
"""Archive.org CDX history check: does an available name have a prior life?
Captures>0 => previously registered and dropped (possible aged-domain value)."""
import urllib.request,urllib.error,ssl,os,json,threading,time
from concurrent.futures import ThreadPoolExecutor
CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
PROXY=os.environ['HTTPS_PROXY']
_tl=threading.local()
def op():
    if not hasattr(_tl,'o'):
        _tl.o=urllib.request.build_opener(urllib.request.ProxyHandler({'https':PROXY}),
                                          urllib.request.HTTPSHandler(context=CTX))
    return _tl.o
def hist(n):
    d=n+".com"
    url=(f"https://web.archive.org/cdx/search/cdx?url={d}&output=json"
         f"&fl=timestamp&collapse=timestamp:4&limit=300")
    for _ in range(3):
        try:
            r=op().open(url,timeout=25); data=json.loads(r.read().decode() or "[]")
            rows=data[1:] if data else []
            if not rows: return (d,0,None,None)
            ys=sorted({x[0][:4] for x in rows})
            return (d,len(rows),ys[0],ys[-1])
        except Exception:
            time.sleep(1.5); _tl.o=None
    return (d,-1,None,None)

PREMIUM={"vault","forge","grid","rail","ledger","core","layer","stack","works","desk",
         "base","engine","bridge","anchor","beacon","compass","atlas","signal","guard"}
avail2={l.split("\t")[0] for l in open("rdap_results2.tsv") if l.rstrip().endswith("\tAVAIL")}
meta2={json.loads(l)["n"]:json.loads(l) for l in open("candidates2.jsonl")}
targets=[n for n in avail2 if meta2[n]["parts"][1] in PREMIUM and len(n)<=11]
targets+= [l.split("\t")[0] for l in open("rdap_results3.tsv") if l.rstrip().endswith("\tAVAIL")]
targets=sorted(set(targets))
print(f"checking Archive.org history for {len(targets)} finalists...\n")
res=list(ThreadPoolExecutor(max_workers=16).map(hist,targets))
withhist=[r for r in res if r[1]>0]
errs=[r for r in res if r[1]<0]
print(f"NO history (never registered): {sum(1 for r in res if r[1]==0)}")
print(f"WITH history (previously registered/dropped): {len(withhist)}")
print(f"lookup errors: {len(errs)}\n")
for d,c,a,b in sorted(withhist,key=lambda x:-x[1]):
    print(f"  {d:22s} captures={c:4d}  {a}-{b}")
