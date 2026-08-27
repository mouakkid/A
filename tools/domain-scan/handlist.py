# -*- coding: utf-8 -*-
"""Hand-authored high-conviction names: the ones a domain investor would actually WANT.
Tests the real question -- is any genuinely premium name still unregistered?"""
import json,re
NAMES = """
bulwark keystone lodestar waypoint bedrock backbone guardrail crucible linchpin fulcrum
vanguard sentinel citadel bastion aegis praxis verity probity axiom vertex quanta lumen
cadence abacus quorum chancery exchequer steward warrant covenant concord accord tally
throughline groundwork wellspring watershed stronghold foothold cornerstone milepost
sextant astrolabe chronometer plumbline harbinger emissary outrider capstan windlass
meridian parallax azimuth zenith armature trellis confluence tributary promontory
provost registrar curator tribunal indenture entente
shipproof clearproof trueproof sureproof proofpoint prooftrail proofmark proofline
trustmark trustline trustpoint trustpath trustbridge trustanchor trustworks
clearledger openledger trueledger swiftledger clearbook openbook truebook
paypath payline paypoint paybridge payworks payanchor paybeacon paycompass
settleline settlepath settlepoint clearpath clearline clearpoint clearbridge
remitline remitpath remitpoint remitbridge remitworks
carbonline carbonpath carbonmark carbonproof carbontrail carbonworks carbonbeacon
freightline freightpath freightmark freightworks freightbeacon freightbridge
fleetpath fleetline fleetmark fleetproof fleetbeacon fleetbridge fleetworks
riskline riskpath riskmark riskproof risktrail riskbeacon riskbridge riskworks
threatline threatpath threatmark threatbeacon threatbridge
policyline policypath policymark policyproof policytrail policybeacon policyworks
consentline consentpath consentmark consentproof consenttrail consentworks
auditline auditpath auditmark auditproof audittrail auditbeacon auditworks
evidenceline evidencepath evidencemark evidencetrail
accessline accesspath accessmark accessproof accesstrail accessbeacon
identityline identitypath identitymark identityproof
contextline contextpath contextmark contextbridge contextbeacon contextworks
modelline modelpath modelmark modelbridge modelbeacon modelworks modelproof
agentline agentpath agentmark agentbridge agentbeacon agentworks agentproof
promptline promptpath promptmark promptbridge promptworks
evalline evalpath evalmark evalbridge evalworks evalproof
inferline inferpath infermark inferbridge inferworks infercore infergrid inferrail
signalline signalpath signalmark signalbridge signalworks signalbeacon
traceline tracepath tracemark tracebridge traceworks tracebeacon
schemaline schemapath schemamark schemabridge schemaworks
lineageline lineagepath lineagemark lineagebridge lineageworks
buildline buildpath buildmark buildbridge buildbeacon
deployline deploypath deploymark deploybridge deploybeacon deployworks
releaseline releasepath releasemark releasebridge releaseworks
triageline triagepath triagemark triagebridge triageworks triagebeacon
intakeline intakepath intakemark intakebridge intakeworks
claimsline claimspath claimsmark claimsbridge claimsworks
privacyline privacypath privacymark privacyproof privacytrail privacyworks
vendorline vendorpath vendormark vendorproof vendortrail vendorworks
incidentline incidentpath incidentmark incidenttrail
shiftproof swiftproof solidproof steadyproof levelproof
northstack northgrid northrail northledger northforge northvault
truegrid truerail trueforge truevault truestack truecore
opengrid openrail openforge openvault openstack opencore
swiftgrid swiftrail swiftforge swiftvault swiftstack swiftcore swiftledger
solidgrid solidrail solidforge solidvault solidstack solidcore solidledger
clearvault clearforge clearcore clearstack cleargrid clearrail
primegrid primerail primeforge primevault primestack primecore primeledger
keenledger keenforge keenvault keengrid
"""
names=sorted({w.strip().lower() for w in NAMES.split() if w.strip() and re.fullmatch(r"[a-z]+",w.strip())})
with open("candidates3.jsonl","w") as f:
    for n in names:
        f.write(json.dumps({"n":n,"src":"handpicked","sector":"curated","words":2,"parts":[n]})+"\n")
print("hand-authored high-conviction names:",len(names))
