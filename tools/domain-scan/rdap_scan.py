# -*- coding: utf-8 -*-
"""Authoritative bulk availability screen against the Verisign .com RDAP registry.
HTTP 404 => no registration record exists => domain is genuinely unregistered.
HTTP 200 => registration record exists => taken.
Resumable: already-checked names are skipped on restart."""
import urllib.request, urllib.error, ssl, os, sys, json, time, random, threading
from concurrent.futures import ThreadPoolExecutor

CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
PROXY = os.environ['HTTPS_PROXY']
OUT = "rdap_results.tsv"
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 10**9
WORKERS = int(sys.argv[2]) if len(sys.argv) > 2 else 32

def make_opener():
    return urllib.request.build_opener(
        urllib.request.ProxyHandler({'https': PROXY}),
        urllib.request.HTTPSHandler(context=CTX))

_tl = threading.local()
def opener():
    if not hasattr(_tl, "o"): _tl.o = make_opener()
    return _tl.o

lock = threading.Lock()
stats = {"avail": 0, "taken": 0, "err": 0, "429": 0, "done": 0}
t0 = time.time()

def check(name):
    url = f"https://rdap.verisign.com/com/v1/domain/{name}.com"
    for attempt in range(5):
        try:
            r = opener().open(url, timeout=20)
            r.read(1); r.close()
            return "TAKEN"
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return "AVAIL"
            if e.code in (429, 503):
                with lock: stats["429"] += 1
                time.sleep((2 ** attempt) + random.random() * 2)
                continue
            return f"HTTP{e.code}"
        except Exception:
            time.sleep(0.5 * (attempt + 1) + random.random())
            _tl.o = make_opener()
    return "ERR"

def worker(name):
    res = check(name)
    with lock:
        stats["done"] += 1
        if res == "AVAIL": stats["avail"] += 1
        elif res == "TAKEN": stats["taken"] += 1
        else: stats["err"] += 1
        fh.write(f"{name}\t{res}\n")
        if stats["done"] % 2000 == 0:
            fh.flush()
            el = time.time() - t0
            print(f"  {stats['done']:6d} checked | {stats['avail']:5d} avail | "
                  f"{stats['err']:4d} err | {stats['429']:4d} throttle | "
                  f"{stats['done']/el:6.1f}/s | {el:6.0f}s", flush=True)

# ---- load candidates in priority order
rows = [json.loads(l) for l in open("candidates.jsonl")]
PRIO = {"single": 0, "compound": 1, "compound_rev": 2, "brandable": 3}
random.seed(7)
random.shuffle(rows)
rows.sort(key=lambda r: PRIO.get(r["src"], 9))

done = set()
if os.path.exists(OUT):
    done = {l.split("\t")[0] for l in open(OUT) if "\t" in l}
todo = [r["n"] for r in rows if r["n"] not in done][:LIMIT]
print(f"already done: {len(done)} | queued this run: {len(todo)} | workers: {WORKERS}", flush=True)

fh = open(OUT, "a")
with ThreadPoolExecutor(max_workers=WORKERS) as ex:
    list(ex.map(worker, todo))
fh.flush(); fh.close()
el = time.time() - t0
print(f"RUN COMPLETE: {stats['done']} checked in {el:.0f}s ({stats['done']/max(el,1):.1f}/s) "
      f"| avail={stats['avail']} taken={stats['taken']} err={stats['err']} throttle={stats['429']}")
