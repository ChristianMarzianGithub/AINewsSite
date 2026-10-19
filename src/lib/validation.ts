import { z } from "zod";
import { articleTypes, categories, statuses } from "./constants";

export const articleSchema = z.object({
  title: z.string().trim().min(3).max(180), subtitle: z.string().max(300).default(""), summary: z.string().max(700).default(""),
  body: z.string().max(100_000).default(""), category: z.enum(categories), articleType: z.enum(articleTypes),
  status: z.enum(statuses).default("DRAFT"), featured: z.boolean().default(false), tags: z.array(z.string().max(40)).max(20).default([]),
  personaId: z.string().nullable().optional(), researchId: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(), imageCaption: z.string().max(300).nullable().optional(), imageCredit: z.string().max(200).nullable().optional(),
  disclosureEnabled: z.boolean().default(false), aiGenerated: z.boolean().default(false), claimsToVerify: z.array(z.string()).default([]),
});
export const researchSchema = z.object({
  topic: z.string().trim().min(5).max(500), questions: z.string().max(2000).default(""),
  depth: z.enum(["QUICK", "STANDARD", "DEEP"]).default("STANDARD"), timeRange: z.enum(["24h", "7d", "30d", "12m", "all"]).default("7d"),
  geographicFocus: z.string().max(100).default("Deutschland"), preferredSources: z.string().max(500).default(""),
});
export const personaSchema = z.object({ name: z.string().trim().min(2).max(100), age: z.number().int().min(18).max(110).nullable().optional(), background: z.string().max(2000), politicalOrientation: z.string().max(300), values: z.string().max(1000), writingStyle: z.string().max(1000), perspective: z.string().max(1000), instructions: z.string().max(2000) });
