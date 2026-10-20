import dotenv from "dotenv";
import { db } from "../src/lib/db";
import { writeDraft } from "../src/lib/ai";

dotenv.config({ path: ".env.local", quiet: true });
const research = await db.researchSession.findFirst({
  where: { status: "COMPLETE", liveSearch: true }, orderBy: { createdAt: "desc" },
  include: { facts: { include: { sources: { include: { source: true } } } }, sources: true },
});
if (!research) throw new Error("No completed research dossier found.");
const sourceUrls = new Set(research.sources.filter(source => source.included).map(source => source.url));
const evidence = JSON.stringify({ searchedAt: research.searchedAt, facts: research.facts.map(fact => ({ claim: fact.claim, status: fact.verificationStatus, sources: fact.sources.map(link => link.source.url).filter(url => sourceUrls.has(url)) })).filter(fact => fact.sources.length), sourceUrls: [...sourceUrls] });
const draft = await writeDraft({ topic: research.topic, persona: "Neutral", type: "Nachricht", length: "300", instructions: "", research: evidence });
console.log(JSON.stringify({ researchId: research.id, titleLength: draft.title.length, bodyLength: draft.body.length, sources: draft.sourceUrls.length }));
