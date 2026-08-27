# -*- coding: utf-8 -*-
"""Curated word banks for commercial .com candidate generation.
Organised so that ANY combination of a lead + head is at least linguistically coherent.
Sectors follow the brief: AI infra, cyber/identity, RegTech, data infra, devtools,
workflow automation, robotics, climate/energy, healthtech, fintech/payments, privacy,
logistics, creator tools, B2B/vertical SaaS, spatial computing, defence-adjacent.
"""

# ---------------------------------------------------------------- LEADS (modifiers)
LEADS = {
 "fintech": ["pay","ledger","settle","clear","remit","escrow","invoice","payout","tender",
             "float","treasury","yield","vault","mint","coin","credit","debit","charge"],
 "regtech": ["comply","audit","attest","charter","statute","policy","control","mandate",
             "consent","record","register","filing","disclose","warrant","covenant"],
 "cyber":   ["cipher","guard","sentry","shield","warden","bastion","citadel","perimeter",
             "keystone","sentinel","picket","rampart","harden","patrol"],
 "identity":["ident","credential","passport","badge","token","claim","proof","verify",
             "attest","trust","seal","signet","emblem"],
 "data":    ["signal","metric","telemetry","trace","probe","lens","prism","gauge","index",
             "cohort","schema","column","tabular","dataset","corpus","facet"],
 "devtools":["build","compile","deploy","runtime","artifact","registry","pipeline","commit",
             "branch","merge","patch","release","staging","rollback"],
 "ai":      ["infer","reason","prompt","context","model","weight","tensor","vector","embed",
             "corpus","agent","reckon","cognate","synapse"],
 "workflow":["route","dispatch","handoff","queue","cadence","tempo","sequence","relay",
             "trigger","approve","escalate","assign","schedule"],
 "climate":["carbon","ember","solar","hydro","thermal","volt","ampere","kilowatt","grid",
            "turbine","biomass","offset","emission","renew"],
 "logistics":["freight","cargo","haul","fleet","depot","pallet","manifest","consign",
              "dispatch","transit","lading","warehouse","inbound","lastmile"],
 "health":  ["clinic","triage","cohort","intake","chart","referral","formulary","dosage",
             "vitals","bedside","careteam","payer"],
 "robotics":["kinetic","actuate","servo","gantry","payload","telemetry","autonomy","fleet",
             "cell","shopfloor","cobot"],
 "spatial": ["spatial","depth","parallax","volumetric","lidar","mesh","occlusion","anchor"],
 "creator": ["studio","reel","canvas","palette","render","montage","storyboard","cutlist"],
 "quality": ["swift","brisk","keen","clear","plain","solid","sound","steady","level","true",
             "prime","crisp","clean","bright","sharp","quiet","calm","north","first","open"],
 "action":  ["ship","shift","forge","cast","tune","trim","sync","scale","span","trace",
             "track","scan","sift","sort","rank","tier","gate","steer","pilot","chart","plot",
             "draft","frame","craft","weave","bind","link","join","merge","fuse","pair",
             "match","align","ground","anchor","moor","dock","launch","lift","raise","boost",
             "drive","surge","flow","stream","feed","fuel","spark","kindle","beam"],
}

# ---------------------------------------------------------------- HEADS (nouns)
HEADS = {
 "infra":  ["grid","rail","rails","forge","works","foundry","engine","core","stack","base",
            "mesh","fabric","kernel","anchor","beacon","harbor","port","dock","vault","ledger",
            "arc","atlas","compass","helm","bridge","span","tower","gate","keep","layer",
            "conduit","channel","trunk","spine","lattice","frame","truss","pillar","plinth"],
 "watch":  ["guard","watch","sentry","shield","seal","warden","picket","beacon","lantern",
            "lookout","vigil","patrol"],
 "signal": ["signal","pulse","trace","track","radar","sonar","gauge","meter","dial","index",
            "chart","graph","map","survey","probe","sensor","lens","scope","prism"],
 "flow":   ["flow","stream","current","tide","wave","drift","cadence","tempo","route","lane",
            "path","trail","orbit","circuit","relay","switch","loop","thread","weave","braid"],
 "office": ["desk","bench","board","panel","roster","docket","folio","brief","ledger","register",
            "dossier","almanac","codex","manifest","charter","record"],
 "place":  ["harbor","haven","dock","yard","depot","bay","cove","ridge","summit","crest","peak",
            "basin","delta","cape","reach","landing","quay","wharf"],
 "craft":  ["forge","kiln","mill","press","anvil","loom","studio","atelier","workshop","bench"],
 "energy": ["spark","ember","flare","torch","kindle","volt","amp","dynamo","turbine","reactor"],
}

# ---------------------------------------------------------------- strong single words
SINGLE_WORDS = [
 # commercially meaningful, pronounceable, brandable dictionary terms
 "bulwark","keystone","touchstone","lodestar","lodestone","bellwether","waypoint","landfall",
 "throughline","groundwork","clearing","bedrock","backbone","crosswalk","handrail","guardrail",
 "trailhead","wellspring","headwater","watershed","tidewater","freehold","stronghold",
 "foothold","threshold","cornerstone","milepost","milestone","signpost","lamppost",
 "quarry","forge","foundry","crucible","furnace","kiln","smithy","armory","arsenal",
 "granary","larder","pantry","cellar","vault","strongbox","coffer","treasury",
 "ledger","docket","dossier","almanac","codex","folio","compendium","register","cadastre",
 "sextant","astrolabe","theodolite","chronometer","barometer","altimeter","tachometer",
 "plumbline","spiritlevel","calipers","micrometer",
 "harbinger","herald","envoy","emissary","legate","courier","runner","outrider","vanguard",
 "linchpin","fulcrum","pivot","hinge","tenon","dovetail","mortise","gusset","flange",
 "capstan","windlass","winch","pulley","sheave","davit","gantry","derrick",
 "aqueduct","viaduct","causeway","towpath","turnpike","thruway",
 "meridian","parallax","azimuth","declination","apogee","perigee","zenith","nadir",
 "alloy","amalgam","filigree","lattice","trellis","armature","scaffold",
 "tinder","kindling","emberly","flint","tallow",
 "cairn","obelisk","monolith","plinth","pedestal","abutment",
 "estuary","confluence","tributary","headland","promontory",
 "quorum","tribunal","chancery","exchequer","curator","registrar","provost","steward",
 "warrant","writ","indenture","covenant","charter","concord","accord","entente",
]

# ------------------------------------------------------- phonetic building blocks
BR_ONSETS = ["b","br","c","cl","cr","d","dr","f","fl","fr","g","gl","gr","h","j","k","kr",
             "l","m","n","p","pl","pr","qu","r","s","sk","sl","sn","sp","st","str","t","tr",
             "v","w","z"]
BR_VOWELS = ["a","e","i","o","u","ai","ea","ei","ia","io","oa","ou","au"]
BR_CODAS  = ["b","d","f","g","k","l","m","n","p","r","s","t","v","x","z","ld","lt","nd",
             "nk","nt","rd","rk","rn","rt","sk","st"]
BR_TAILS  = ["a","o","ia","io","um","us","ix","ex","yx","on","an","en","or","ar","er","el",
             "il","ol","is","os","as","ly","ry","ta","na","ra","va","za","la","ma"]
