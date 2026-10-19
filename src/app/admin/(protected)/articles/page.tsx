import Link from "next/link";
import { db } from "@/lib/db";
import { dateDE } from "@/lib/constants";

export const dynamic="force-dynamic";
export default async function ArticlesPage(){const articles=await db.article.findMany({orderBy:{updatedAt:"desc"},include:{persona:true}});return <><div className="admin-head"><h1>Artikel</h1><Link className="btn" href="/admin/articles/new">Artikel erstellen</Link></div><div className="panel"><table className="table"><thead><tr><th>Titel</th><th>Ressort</th><th>Status</th><th>Bearbeitet</th></tr></thead><tbody>{articles.map(article=><tr key={article.id}><td><Link href={`/admin/articles/${article.id}`}><strong>{article.title}</strong></Link><div className="meta">{article.persona?.name ?? "Redaktion"}{article.aiGenerated ? " · KI-unterstützt" : ""}</div></td><td>{article.category}</td><td><span className="badge">{article.status}</span></td><td>{dateDE(article.updatedAt)}</td></tr>)}</tbody></table>{!articles.length && <p>Noch keine Artikel vorhanden.</p>}</div></>}
