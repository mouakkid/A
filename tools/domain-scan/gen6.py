# -*- coding: utf-8 -*-
"""Evocative brandable pairs -- nature, materials, light, structure, quality.
Deliberately NOT B2B jargon: these read as company names a founder would be proud
of, and appeal to many buyer categories at once (funds, studios, agencies, SaaS)."""
import itertools,re,json
A = {  # evocative modifiers
 "material":["iron","steel","copper","brass","bronze","silver","pewter","slate","marble",
             "granite","flint","amber","jade","onyx","opal","quartz","ember","cinder",
             "vellum","linen","canvas","cedar","alder","birch","aspen","walnut","oak"],
 "light":   ["dawn","dusk","aurora","lumen","north","polar","solstice","zenith","meridian",
             "comet","stellar","lunar","solar","glimmer","kindle","beacon","lantern"],
 "quality": ["quiet","silent","still","swift","keen","bright","clear","true","bold","noble",
             "gentle","steady","candid","ardent","earnest","sterling","rigid","stark"],
 "nature":  ["harbor","meadow","thicket","bramble","heather","willow","laurel","myrtle",
             "clover","juniper","hollow","ridge","vale","glen","heath","moor","dune",
             "cove","summit","cascade","current","tide","river","brook"],
}
B = {  # evocative heads
 "structure":["harbor","haven","keep","tower","spire","arch","vault","forge","foundry",
              "mill","atelier","lodge","hearth","anvil","bridge","gate","court","hall"],
 "craft":   ["quill","chisel","loom","press","kiln","compass","sextant","lantern","anchor",
             "beacon","ledger","almanac","codex","folio"],
 "nature":  ["harbor","hollow","ridge","vale","glen","grove","thicket","meadow","field",
             "creek","brook","river","summit","crest","cove","reach","landing"],
}
def ok(s):
    return bool(re.fullmatch(r"[a-z]{6,13}",s)) and not re.search(r"(.)\1\1",s)
def seam(a,b):
    return a!=b and a[-1]!=b[0] and not b.startswith(a) and not a.endswith(b)
out={}
for (ga,la),(gb,lb) in itertools.product(A.items(),B.items()):
    for x,y in itertools.product(la,lb):
        if not seam(x,y): continue
        n=x+y
        if ok(n) and n not in out:
            out[n]={"n":n,"src":"evocative","sector":f"{ga}+{gb}","words":2,"parts":[x,y]}
with open("candidates6.jsonl","w") as f:
    for r in out.values(): f.write(json.dumps(r)+"\n")
print("evocative brandable pairs:",len(out))
