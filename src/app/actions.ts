"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { checkPassword, endSession, loginIp, requireAction, startSession } from "@/lib/auth";
import { articleSchema, personaSchema, researchSchema } from "@/lib/validation";
import { liveResearch, writeDraft } from "@/lib/ai";
import { slugify } from "@/lib/constants";
import { canTransition } from "@/lib/workflow";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import OpenAI from "openai";

function str(form: FormData, key: string) { return String(form.get(key) ?? "").trim(); }
function checkUrl(url: string) { const parsed = new URL(url); if (!["https:", "http:"].includes(parsed.protocol) || ["localhost", "127.0.0.1"].includes(parsed.hostname)) throw new Error("Nur öffentliche HTTP(S)-Quellen sind erlaubt."); return parsed.href; }
export async function login(form: FormData) {
  const origin = (await import("next/headers")).headers;
  const h = await origin();
  if (!h.get("origin") || new URL(h.get("origin")!).host !== (h.get("x-forwarded-host") ?? h.get("host"))) throw new Error("Ungültige Anfragequelle.");
  if (!checkPassword(str(form, "password"), await loginIp())) redirect("/admin/login?error=1");
  await startSession(); redirect("/admin");
}
export async function logout() { await requireAction(); await endSession(); redirect("/admin/login"); }
export async function saveArticle(form: FormData) {
  await requireAction();
  const id = str(form, "id");
  const existing = id ? await db.article.findUnique({ where: { id } }) : null;
  let imageUrl = str(form,"imageUrl") || null;
  if (imageUrl && !(/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("/uploads/"))) throw new Error("Bild-URL muss HTTP(S) verwenden.");
  const file = form.get("image");
  if (file instanceof File && file.size) {
    if (file.size > 5_000_000) throw new Error("Bilddatei darf höchstens 5 MB groß sein.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png = bytes.slice(0,8).every((v,i)=>v===[137,80,78,71,13,10,26,10][i]);
    const jpg = bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
    const webp = new TextDecoder().decode(bytes.slice(0,4))==="RIFF" && new TextDecoder().decode(bytes.slice(8,12))==="WEBP";
    if (!png && !jpg && !webp) throw new Error("Nur PNG, JPEG und WebP sind erlaubt.");
    const name = `${randomUUID()}.${png?"png":jpg?"jpg":"webp"}`;
    const directory = join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, name), bytes, { flag: "wx" });
    imageUrl = `/uploads/${name}`;
  }
  const data = articleSchema.parse({ title: str(form,"title"), subtitle: str(form,"subtitle"), summary: str(form,"summary"), body: str(form,"body"), category: str(form,"category"), articleType: str(form,"articleType"), status: existing?.status ?? "DRAFT", featured: form.has("featured"), tags: str(form,"tags").split(",").map(v=>v.trim()).filter(Boolean), personaId: str(form,"personaId") || null, researchId: str(form,"researchId") || null, imageUrl, imageCaption: str(form,"imageCaption") || null, imageCredit: str(form,"imageCredit") || null, disclosureEnabled: form.has("disclosureEnabled"), aiGenerated: existing?.aiGenerated ?? false, claimsToVerify: existing ? JSON.parse(existing.claimsToVerify) : [] });
  const slug = existing?.slug ?? `${slugify(data.title)}-${Math.random().toString(36).slice(2,7)}`;
  const payload = { ...data, tags: JSON.stringify(data.tags), claimsToVerify: JSON.stringify(data.claimsToVerify), slug, publishedAt: data.status === "PUBLISHED" ? existing?.publishedAt : null };
  const article = existing ? await db.article.update({ where: { id }, data: { ...payload, revisions: { create: { title: existing.title, body: existing.body } } } }) : await db.article.create({ data: payload });
  revalidatePath("/"); redirect(`/admin/articles/${article.id}`);
}
export async function setArticleStatus(form: FormData) {
  await requireAction(); const id = str(form,"id"); const next = str(form,"status");
  const article = await db.article.findUniqueOrThrow({ where: { id } });
  if (!canTransition(article.status, next)) throw new Error("Ungültiger Statuswechsel.");
  await db.article.update({ where: { id }, data: { status: next, publishedAt: next === "PUBLISHED" ? new Date() : null } });
  revalidatePath("/"); revalidatePath(`/artikel/${article.slug}`); redirect(`/admin/articles/${id}`);
}
export async function deleteArticle(form: FormData) { await requireAction(); await db.article.delete({ where: { id: str(form,"id") } }); revalidatePath("/"); redirect("/admin/articles"); }
export async function linkArticleSource(form: FormData) {
  await requireAction();
  const articleId = str(form, "articleId");
  const sourceId = str(form, "sourceId");
  const [article, source] = await Promise.all([db.article.findUniqueOrThrow({ where: { id: articleId } }), db.researchSource.findUniqueOrThrow({ where: { id: sourceId } })]);
  if (!article.researchId || article.researchId !== source.researchSessionId) throw new Error("Quelle und Artikel gehören nicht zur gleichen Recherche.");
  await db.articleSource.upsert({ where: { articleId_sourceId: { articleId, sourceId } }, update: {}, create: { articleId, sourceId } });
  revalidatePath(`/admin/articles/${articleId}`);
}
export async function unlinkArticleSource(form: FormData) {
  await requireAction();
  const articleId = str(form, "articleId");
  await db.articleSource.delete({ where: { articleId_sourceId: { articleId, sourceId: str(form, "sourceId") } } });
  revalidatePath(`/admin/articles/${articleId}`);
}
export async function savePersona(form: FormData) {
  await requireAction(); const id = str(form,"id");
  const data = personaSchema.parse({ name: str(form,"name"), age: str(form,"age") ? Number(str(form,"age")) : null, background: str(form,"background"), politicalOrientation: str(form,"politicalOrientation"), values: str(form,"values"), writingStyle: str(form,"writingStyle"), perspective: str(form,"perspective"), instructions: str(form,"instructions") });
  if (id) await db.persona.update({ where: { id }, data }); else await db.persona.create({ data });
  revalidatePath("/admin/personas"); redirect("/admin/personas");
}
export async function deletePersona(form: FormData) { await requireAction(); await db.persona.delete({ where: { id: str(form,"id") } }); revalidatePath("/admin/personas"); redirect("/admin/personas"); }
export async function startResearch(form: FormData) {
  await requireAction();
  const input = researchSchema.parse({ topic: str(form,"topic"), questions: str(form,"questions"), depth: str(form,"depth"), timeRange: str(form,"timeRange"), geographicFocus: str(form,"geographicFocus"), preferredSources: str(form,"preferredSources") });
  const session = await db.researchSession.create({ data: { title: input.topic, topic: input.topic, questions: input.questions, depth: input.depth, timeRange: input.timeRange, geographicFocus: input.geographicFocus } });
  try {
    const { dossier, citations, model } = await liveResearch(input);
    await db.researchSession.update({ where: { id: session.id }, data: { summary: dossier.summary, conflicts: JSON.stringify(dossier.conflicts), missingInfo: JSON.stringify(dossier.missingInfo), timeline: JSON.stringify(dossier.timeline), perspectives: JSON.stringify(dossier.perspectives), status: "COMPLETE", model, liveSearch: true, searchedAt: new Date() } });
    for (const [url, title] of citations) await db.researchSource.create({ data: { researchSessionId: session.id, url, title, publisher: new URL(url).hostname } });
    const sources = await db.researchSource.findMany({ where: { researchSessionId: session.id } });
    for (const fact of dossier.facts) await db.researchFact.create({ data: { researchSessionId: session.id, claim: fact.claim, notes: fact.notes, verificationStatus: fact.verificationStatus, sources: { create: fact.sourceUrls.flatMap(url => { const source = sources.find(s => s.url === url); return source ? [{ sourceId: source.id }] : []; }) } } });
  } catch (error) { await db.researchSession.update({ where: { id: session.id }, data: { status: "FAILED", summary: error instanceof Error ? error.message : "Recherche fehlgeschlagen." } }); }
  redirect(`/admin/research/${session.id}`);
}
export async function addSource(form: FormData) { await requireAction(); const id = str(form,"researchId"); const url = checkUrl(str(form,"url")); await db.researchSource.upsert({ where: { researchSessionId_url: { researchSessionId: id, url } }, update: { included: true }, create: { researchSessionId: id, url, title: str(form,"title") || new URL(url).hostname, publisher: new URL(url).hostname, notes: str(form,"notes") } }); revalidatePath(`/admin/research/${id}`); }
export async function toggleSource(form: FormData) { await requireAction(); const source = await db.researchSource.findUniqueOrThrow({ where: { id: str(form,"id") } }); await db.researchSource.update({ where: { id: source.id }, data: { included: !source.included } }); revalidatePath(`/admin/research/${source.researchSessionId}`); }
export async function addNote(form: FormData) { await requireAction(); const id = str(form,"researchId"); await db.researchNote.create({ data: { researchSessionId: id, content: str(form,"content").slice(0,5000) } }); revalidatePath(`/admin/research/${id}`); }
export async function renameResearch(form: FormData) { await requireAction(); const id = str(form,"id"); await db.researchSession.update({ where: { id }, data: { title: str(form,"title").slice(0,200) } }); revalidatePath(`/admin/research/${id}`); }
export async function deleteResearch(form: FormData) { await requireAction(); await db.researchSession.delete({ where: { id: str(form,"id") } }); redirect("/admin/research/library"); }
export async function testOpenAIConnection() {
  await requireAction();
  if (!process.env.OPENAI_API_KEY) redirect("/admin/settings?connection=missing");
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 10_000, maxRetries: 0 });
    await client.models.retrieve(process.env.OPENAI_RESEARCH_MODEL || "gpt-5-mini");
  } catch { redirect("/admin/settings?connection=failed"); }
  redirect("/admin/settings?connection=ok");
}
export async function generateArticle(form: FormData) {
  await requireAction(); const researchId = str(form,"researchId"); const research = researchId ? await db.researchSession.findUnique({ where: { id: researchId }, include: { facts: { include: { sources: { include: { source: true } } } }, sources: true } }) : null;
  const personaId = str(form,"personaId"); const persona = personaId ? await db.persona.findUnique({ where: { id: personaId } }) : null;
  const sourceIds = research?.sources.filter(s => s.included).map(s => s.id) ?? [];
  const evidence = research ? JSON.stringify({ searchedAt: research.searchedAt, facts: research.facts.map(f => ({ claim: f.claim, status: f.verificationStatus, sources: f.sources.map(s => s.source.url).filter(url => research.sources.some(source => source.url === url && source.included)) })), sourceUrls: research.sources.filter(s => s.included).map(s => s.url) }) : undefined;
  const draft = await writeDraft({ topic: str(form,"topic") || research?.topic || "", persona: persona ? `${persona.name}: ${persona.writingStyle}; ${persona.perspective}; ${persona.instructions}` : "Neutral", type: str(form,"articleType"), length: str(form,"length"), instructions: str(form,"instructions"), research: evidence });
  const category = str(form,"category") || "Gesellschaft";
  const article = await db.article.create({ data: { slug: `${slugify(draft.title)}-${Math.random().toString(36).slice(2,7)}`, title: draft.title, subtitle: draft.subtitle, summary: draft.summary, body: draft.body, category, articleType: str(form,"articleType") || "Analyse", tags: JSON.stringify(draft.tags), claimsToVerify: JSON.stringify(draft.claimsToVerify), personaId: persona?.id, researchId: research?.id, aiGenerated: true, disclosureEnabled: true, status: "GENERATED", sources: { create: draft.sourceUrls.flatMap(url => { const source = research?.sources.find(s => s.url === url && sourceIds.includes(s.id)); return source ? [{ sourceId: source.id }] : []; }) } } });
  redirect(`/admin/articles/${article.id}`);
}
