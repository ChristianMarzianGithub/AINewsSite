import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env.local", quiet: true });
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30_000, maxRetries: 0 });
const response = await client.responses.create({
  model: process.env.OPENAI_RESEARCH_MODEL || "gpt-5-mini",
  tools: [{ type: "web_search" }],
  tool_choice: "required",
  include: ["web_search_call.action.sources"],
  input: "Search for the official Next.js website and reply briefly with its URL.",
});
const calls = response.output.filter(item => item.type === "web_search_call");
console.log(JSON.stringify({ completedSearches: calls.filter(item => item.status === "completed").length, sources: calls.flatMap(item => item.action?.type === "search" ? item.action.sources ?? [] : []).length }));
