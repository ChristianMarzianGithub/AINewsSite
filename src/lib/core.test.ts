import { describe, expect, it } from "vitest";
import { articleSchema, researchSchema } from "./validation";
import { canTransition } from "./workflow";
import { renderMarkdown } from "./content";
import { slugify } from "./constants";
import { parseDraftResponse, parseResearchResponse, researchError, responseUrls } from "./ai";
import OpenAI from "openai";

describe("redaktioneller Ablauf", () => {
  it("requires approval before publishing a generated draft", () => {
    expect(canTransition("GENERATED", "PUBLISHED")).toBe(false);
    expect(canTransition("GENERATED", "APPROVED")).toBe(true);
    expect(canTransition("APPROVED", "PUBLISHED")).toBe(true);
    expect(canTransition("PUBLISHED", "DRAFT")).toBe(true);
  });
  it("rejects invalid categories and research depth", () => {
    expect(articleSchema.safeParse({ title: "Ein Artikel", category: "Unknown", articleType: "Nachricht" }).success).toBe(false);
    expect(researchSchema.safeParse({ topic: "Eine gültige Recherche", depth: "FAKE" }).success).toBe(false);
  });
  it("sanitizes active HTML from article Markdown", () => {
    const html = renderMarkdown("Hallo <script>alert(1)</script> [Link](javascript:alert(1))");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("javascript:");
  });
  it("creates stable readable slugs", () => {
    expect(slugify("Künstliche Intelligenz & Arbeit")).toBe("kunstliche-intelligenz-arbeit");
  });
  it("accepts only URLs present in web search metadata", () => {
    const urls = responseUrls({ output: [
      { type: "web_search_call", action: { sources: [{ url: "https://example.org/report", title: "Report" }] } },
      { type: "message", content: [{ annotations: [{ type: "url_citation", url: "https://example.org/other", title: "Other" }], text: '{"url":"https://invented.example"}' }] },
    ] });
    expect([...urls.keys()]).toEqual(["https://example.org/report", "https://example.org/other"]);
  });
  it("requires a completed web search and sourced facts", () => {
    const response = { status: "completed", output: [
      { type: "web_search_call", status: "completed", action: { sources: [{ url: "https://example.org/report" }] } },
    ], output_text: JSON.stringify({ summary: "Zusammenfassung", facts: [{ claim: "Eine Behauptung", sourceUrls: ["https://example.org/report", "https://invented.example/report"], verificationStatus: "SUPPORTED" }] }) };
    const result = parseResearchResponse(response);
    expect(result.dossier.facts[0].sourceUrls).toEqual(["https://example.org/report"]);
    expect(result.dossier.facts[0].verificationStatus).toBe("REPORTED");
    expect(() => parseResearchResponse({ ...response, output: [] })).toThrow(/Live-Websuche/);
    expect(() => parseResearchResponse({ ...response, output_text: "" })).toThrow(/Recherchebericht/);
    expect(() => parseResearchResponse({ ...response, output_text: "{}" })).toThrow();
  });
  it("shows actionable API errors without exposing provider details", () => {
    const error = new OpenAI.AuthenticationError(401, { message: "expired" }, "expired", new Headers());
    expect(researchError(error)).toMatch(/API-Schlüssel.*abgelaufen/);
  });
  it("normalizes incomplete optional fields without inventing evidence", () => {
    const response = { status: "completed", output: [
      { type: "web_search_call", status: "completed", action: { sources: [{ url: "https://example.org/report" }] } },
    ], output_text: JSON.stringify({ summary: "Bericht", facts: [
      { claim: "Belegte Aussage", notes: null, sourceUrls: ["https://example.org/report", "not a URL"], verificationStatus: "belegt" },
      { claim: "Unbelegte Aussage", sourceUrls: null },
    ], conflicts: null, missingInfo: [null, "Offene Frage"], timeline: [{ date: null, event: "Ereignis" }] }) };
    const { dossier } = parseResearchResponse(response);
    expect(dossier.facts[0]).toMatchObject({ notes: "", sourceUrls: ["https://example.org/report"], verificationStatus: "UNVERIFIED" });
    expect(dossier.facts[1].sourceUrls).toEqual([]);
    expect(dossier.timeline).toEqual([]);
    expect(dossier.missingInfo).toEqual(["Offene Frage"]);
  });
  it("accepts structured verification claims in generated drafts", () => {
    const response = { status: "completed", output_text: JSON.stringify({ title: "Ein neuer Artikel", body: "Ein längerer redaktioneller Absatz. ".repeat(5), claimsToVerify: [{ claim: "Zahl prüfen", source: "unbekannt" }, { text: "Datum prüfen" }], sourceUrls: ["https://example.org/report", "kein Link"], tags: ["KI", null] }) };
    const draft = parseDraftResponse(response);
    expect(draft.claimsToVerify).toEqual(["Zahl prüfen", "Datum prüfen"]);
    expect(draft.sourceUrls).toEqual(["https://example.org/report"]);
    expect(draft.tags).toEqual(["KI"]);
    expect(() => parseDraftResponse({ ...response, status: "incomplete" })).toThrow(/nicht abgeschlossen/);
  });
});
