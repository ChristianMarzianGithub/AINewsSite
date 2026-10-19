import dotenv from "dotenv";
import { liveResearch } from "../src/lib/ai";

dotenv.config({ path: ".env.local", quiet: true });
const result = await liveResearch({
  topic: "Offizielle Website des Deutschen Wetterdienstes",
  questions: "Welche Aufgaben nennt die Behörde auf ihrer offiziellen Website?",
  depth: "QUICK",
  timeRange: "all",
  geographicFocus: "Deutschland",
  preferredSources: "dwd.de",
});
console.log(JSON.stringify({ sources: result.citations.size, facts: result.dossier.facts.length, model: result.model }));
