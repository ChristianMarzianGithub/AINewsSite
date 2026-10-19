import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleForm } from "@/components/article-form";
import { ArticleSources } from "@/components/article-sources";
import { dateDE } from "@/lib/constants";

export const dynamic="force-dynamic";
export default async function EditArticle({params}:{params:Promise<{id:string}>}){const {id}=await params;const [article,personas,researches]=await Promise.all([db.article.findUnique({where:{id},include:{sources:{include:{source:true}},revisions:{orderBy:{createdAt:"desc"},take:5}}}),db.persona.findMany({orderBy:{name:"asc"}}),db.researchSession.findMany({orderBy:{createdAt:"desc"}})]);if(!article)notFound();const available=article.researchId?await db.researchSource.findMany({where:{researchSessionId:article.researchId}}):[];return <><div className="admin-head"><h1>Artikel bearbeiten</h1><span className="badge">{article.status}</span></div><ArticleForm article={article} personas={personas} researches={researches}/><ArticleSources articleId={article.id} linked={article.sources.map(x=>x.source)} available={available}/><div className="panel"><h2>Letzte Fassungen</h2>{article.revisions.map(revision=><p key={revision.id}>{dateDE(revision.createdAt)} · {revision.title}</p>)}</div></>}
