import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions";

const links=[ ["/admin","Dashboard"],["/admin/articles","Artikel"],["/admin/articles/new","Artikel erstellen"],["/admin/research","KI-Recherche"],["/admin/research/library","Recherchearchiv"],["/admin/ai-generator","KI-Artikelgenerator"],["/admin/personas","Autorenprofile"],["/admin/settings","Einstellungen"] ];
export default async function AdminLayout({children}:{children:React.ReactNode}) { await requireAdmin(); return <div className="admin-shell"><aside className="sidebar"><Link className="brand" href="/">Nachrichten<span>blick</span></Link><nav>{links.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</nav><form action={logout} style={{marginTop:35}}><button className="btn secondary">Abmelden</button></form></aside><main className="admin-main">{children}</main></div>; }
