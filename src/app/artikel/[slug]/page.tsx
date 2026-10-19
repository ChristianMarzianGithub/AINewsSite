/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { dateDE, parseList } from "@/lib/constants";
import { renderMarkdown } from "@/lib/content";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { StoryCard } from "@/components/story-card";

export const dynamic = "force-dynamic";
export default async function ArticlePage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const article = await db.article.findFirst({ where: { slug, status: "PUBLISHED" }, include: { persona: true, sources: { include: { source: true } } } });
  if (!article) notFound();
  const related = await db.article.findMany({ where: { status: "PUBLISHED", category: article.category, id: { not: article.id } }, take: 3, orderBy: { publishedAt: "desc" } });
  return <><PublicHeader/><main className="container article-layout"><article><div className="article-header"><span className="kicker">{article.category} · {article.articleType}</span><h1>{article.title}</h1>{article.subtitle && <h2>{article.subtitle}</h2>}<p className="summary">{article.summary}</p><p className="meta">{article.persona?.name ?? "Redaktion Nachrichtenblick"} · {dateDE(article.publishedAt)}</p></div>{article.imageUrl && <figure><img src={article.imageUrl} alt={article.imageCaption ?? "Artikelbild"}/><figcaption className="meta">{article.imageCaption} {article.imageCredit && `· ${article.imageCredit}`}</figcaption></figure>}{["Kommentar","Meinung"].includes(article.articleType) && <div className="notice">Dieser Beitrag ist ein Meinungsstück.</div>}{article.aiGenerated && article.disclosureEnabled && <div className="notice">Dieser Beitrag wurde mit KI-Unterstützung erstellt und redaktionell geprüft.</div>}<div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}/>{parseList(article.tags).length > 0 && <p className="meta">Schlagwörter: {parseList(article.tags).join(" · ")}</p>}<section className="sources"><h2>Quellen</h2>{article.sources.length ? <ol>{article.sources.map(({source})=><li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> <span className="meta">({source.publisher ?? new URL(source.url).hostname})</span></li>)}</ol> : <p className="muted">Für diesen Beitrag sind keine externen Quellen hinterlegt.</p>}</section></article><aside><h2 className="section-title">Mehr aus {article.category}</h2>{related.map(item=><StoryCard key={item.id} article={item}/>)}</aside></main><PublicFooter/></>;
}
