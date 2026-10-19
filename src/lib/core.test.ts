import { describe, expect, it } from "vitest";
import { articleSchema, researchSchema } from "./validation";
import { canTransition } from "./workflow";
import { renderMarkdown } from "./content";
import { slugify } from "./constants";
import { responseUrls } from "./ai";

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
});
