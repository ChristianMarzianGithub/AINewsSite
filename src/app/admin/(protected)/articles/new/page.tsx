import { db } from "@/lib/db";
import { ArticleForm } from "@/components/article-form";
export const dynamic="force-dynamic";
export default async function NewArticle(){const [personas,researches]=await Promise.all([db.persona.findMany({orderBy:{name:"asc"}}),db.researchSession.findMany({orderBy:{createdAt:"desc"}})]);return <><div className="admin-head"><h1>Neuen Artikel erstellen</h1></div><ArticleForm personas={personas} researches={researches}/></>}
