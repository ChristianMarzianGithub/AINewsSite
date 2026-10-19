import { notFound } from "next/navigation";
import { categories, slugify } from "@/lib/constants";
import { db } from "@/lib/db";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
import { StoryCard } from "@/components/story-card";

export const dynamic = "force-dynamic";
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}) { const {slug}=await params; const category=categories.find(c=>slugify(c)===slug); if(!category) notFound(); const articles=await db.article.findMany({where:{category,status:"PUBLISHED"},orderBy:{publishedAt:"desc"}}); return <><PublicHeader/><main className="container hero"><span className="kicker">Ressort</span><h1 className="section-title">{category}</h1>{articles.length ? <div className="cards">{articles.map(article=><StoryCard key={article.id} article={article}/>)}</div> : <p>In diesem Ressort gibt es noch keine veröffentlichten Beiträge.</p>}</main><PublicFooter/></>; }
