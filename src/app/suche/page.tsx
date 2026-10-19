import { db } from "@/lib/db";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { StoryCard } from "@/components/story-card";

export const dynamic = "force-dynamic";
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}) { const q=(await searchParams).q?.trim().slice(0,100) ?? ""; const articles=q ? await db.article.findMany({where:{status:"PUBLISHED",OR:[{title:{contains:q}},{summary:{contains:q}},{body:{contains:q}}]},orderBy:{publishedAt:"desc"},take:50}) : []; return <><PublicHeader/><main className="container hero"><h1 className="section-title">Suche</h1><form className="searchbar"><input name="q" defaultValue={q} placeholder="Thema oder Stichwort" aria-label="Suchbegriff"/><button className="btn">Suchen</button></form>{q && <><p className="muted">{articles.length} Treffer für „{q}“</p><div className="cards">{articles.map(article=><StoryCard key={article.id} article={article}/>)}</div></>}</main><PublicFooter/></>; }
