import json,sys,os
sys.argv=["x","999999","48"]
exec(open("rdap_scan.py").read().replace('"candidates.jsonl"','"candidates2.jsonl"').replace('OUT = "rdap_results.tsv"','OUT = "rdap_results2.tsv"'))
