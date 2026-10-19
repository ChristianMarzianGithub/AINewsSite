import Link from "next/link";
import { db } from "@/lib/db";
import { dateDE } from "@/lib/constants";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { StoryCard } from "@/components/story-card";

export const dynamic = "force-dynamic";
export default async function Home() {
  const articles = await db.article.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }], take: 30 });
  const [lead, ...rest] = articles;
  return <><PublicHeader/><main className="container hero"><div className="eyebrow">Aktuelle Nachrichten · Hintergründe · Meinungen</div>{lead ? <><div className="hero-grid" style={{marginTop:20}}><Link href={`/artikel/${lead.slug}`} className="lead"><span className="kicker">{lead.category} · {lead.articleType}</span><h1>{lead.title}</h1><p>{lead.summary}</p><span className="meta">{dateDE(lead.publishedAt)}</span></Link><div className="side-stack">{rest.slice(0,2).map(article=><Link href={`/artikel/${article.slug}`} className="side-card" key={article.id}><span className="kicker">{article.category}</span><h2>{article.title}</h2><p className="muted">{article.summary}</p><span className="meta">{dateDE(article.publishedAt)}</span></Link>)}</div></div><h2 className="section-title">Weitere Meldungen</h2><div className="cards">{rest.slice(2).map(article=><StoryCard key={article.id} article={article}/>)}</div></> : <div className="placeholder" style={{marginTop:25}}><span className="kicker">Redaktion</span><h1>Nachrichten mit Überblick.</h1><p>Hier erscheinen veröffentlichte Beiträge. Melden Sie sich im Redaktionsbereich an, um den ersten Artikel zu erstellen.</p><Link href="/admin/login" className="btn">Zum Redaktionsbereich</Link></div>}</main><PublicFooter/></>;
}
