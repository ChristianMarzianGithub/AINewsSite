import Link from "next/link";
import { dateDE } from "@/lib/constants";

export function StoryCard({ article }: { article: { slug:string; title:string; summary:string; category:string; publishedAt: Date | null; articleType:string } }) { return <article className="story"><span className="kicker">{article.category} · {article.articleType}</span><h3><Link href={`/artikel/${article.slug}`}>{article.title}</Link></h3><p>{article.summary}</p><span className="meta">{dateDE(article.publishedAt)}</span></article>; }
