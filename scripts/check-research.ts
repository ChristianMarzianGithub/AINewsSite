import dotenv from "dotenv";
import { liveResearch } from "../src/lib/ai";

dotenv.config({ path: ".env.local", quiet: true });
const result = await liveResearch({
  topic: process.argv[2] || "Offizielle Website des Deutschen Wetterdienstes",
  questions: "Welche aktuellen, belegten Fakten und offenen Fragen gibt es?",
  depth: process.argv[2] ? "STANDARD" : "QUICK",
  timeRange: "all",
  geographicFocus: "Deutschland",
  preferredSources: "dwd.de",
});
console.log(JSON.stringify({ sources: result.citations.size, facts: result.dossier.facts.length, sourcedFacts: result.dossier.facts.filter(fact => fact.sourceUrls.length).length, model: result.model }));
