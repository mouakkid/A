import urllib.request,ssl,os,json,threading,time,random
from concurrent.futures import ThreadPoolExecutor
CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
PROXY=os.environ['HTTPS_PROXY']
_tl=threading.local()
def op():
    if not hasattr(_tl,'o') or _tl.o is None:
        _tl.o=urllib.request.build_opener(urllib.request.ProxyHandler({'https':PROXY}),
                                          urllib.request.HTTPSHandler(context=CTX))
    return _tl.o
def hist(n):
    d=n if n.endswith(".com") else n+".com"
    url=(f"https://web.archive.org/cdx/search/cdx?url={d}&output=json&fl=timestamp&limit=200")
    for a in range(6):
        try:
            r=op().open(url,timeout=40); data=json.loads(r.read().decode() or "[]")
            rows=data[1:] if data else []
            if not rows: return (d,0,None,None)
            ys=sorted({x[0][:4] for x in rows})
            return (d,len(rows),ys[0],ys[-1])
        except Exception:
            time.sleep(2*(a+1)+random.random()*3); _tl.o=None
    return (d,-1,None,None)

PREMIUM={"vault","forge","grid","rail","ledger","core","layer","stack","works","desk",
         "base","engine","bridge","anchor","beacon","compass","atlas","signal","guard"}
avail2={l.split("\t")[0] for l in open("rdap_results2.tsv") if l.rstrip().endswith("\tAVAIL")}
meta2={json.loads(l)["n"]:json.loads(l) for l in open("candidates2.jsonl")}
targets=[n for n in avail2 if meta2[n]["parts"][1] in PREMIUM and len(n)<=11]
targets+=[l.split("\t")[0] for l in open("rdap_results3.tsv") if l.rstrip().endswith("\tAVAIL")]
targets=sorted(set(targets))
res=list(ThreadPoolExecutor(max_workers=5).map(hist,targets))
json.dump(res,open("history.json","w"))
wh=[r for r in res if r[1]>0]; er=[r for r in res if r[1]<0]
print(f"checked {len(res)} | never-registered {sum(1 for r in res if r[1]==0)} | "
      f"with-history {len(wh)} | errors {len(er)}\n")
for d,c,a,b in sorted(wh,key=lambda x:-x[1]): print(f"  {d:22s} captures={c:4d}  {a}-{b}")
if er: print("\nstill errored:", ", ".join(r[0] for r in er[:20]))
