# Domain investment scan toolchain — 2026-08-27

Reproducible pipeline behind `RAPPORT-SCAN-DOMAINES-2026-08-27.md`.
**52,446 domains screened against the authoritative Verisign `.com` RDAP registry.**

## Pipeline

| Stage | Script | Purpose |
|---|---|---|
| 1 | `wordbank.py` | Curated sector word banks (AI, cyber, RegTech, fintech, climate, logistics, health…) |
| 2 | `generate.py` | Combinatorial generation → `candidates.jsonl` (46,879 names) |
| 3 | `gen2.py` | Quality-first "container noun" generation → `candidates2.jsonl` (5,231) |
| 4 | `handlist.py` | Hand-authored premium list — the decisive test → `candidates3.jsonl` (336) |
| 5 | `rdap_scan.py` | Concurrent, resumable RDAP availability scanner (~157–210 req/s, 0 errors) |
| 6 | `score.py` | Computable pre-scoring (structure, phonetics, spellability, sector fit) |
| 7 | `semantic.py` | Semantic coherence filter — rejects structurally-good/meaningless names |
| 8 | `history2.py` | Archive.org CDX prior-registration history check |

## Availability method

`GET https://rdap.verisign.com/com/v1/domain/<name>.com`
- **HTTP 404** → no registration record exists → genuinely unregistered
- **HTTP 200** → registration record exists → taken

This is registry-authoritative data, not a reseller's cached availability claim.

## Headline results

| Pass | Checked | Available |
|---|---:|---:|
| Combinatorial | 46,879 | 26,152 |
| Container-noun | 5,231 | 1,502 |
| **Hand-authored premium** | **336** | **11 (3.3 %)** |
| **Total** | **52,446** | **27,665** |

**Key measurement:** 96.7 % of hand-authored premium names were already registered, and
sector-noun + premium-suffix combinations were only 19.2 % available versus 28.7 % for weak
suffixes — a direct measurement of market efficiency.

## Reruns

```bash
python3 generate.py && python3 rdap_scan.py 999999 48   # resumable; skips completed names
python3 score.py && python3 semantic.py
```

Raw results in `results/*.tsv` (`<name>\tAVAIL|TAKEN`) so every claim in the report can be
replayed and contradicted.
