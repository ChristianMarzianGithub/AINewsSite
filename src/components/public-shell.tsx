import Link from "next/link";
import { categories, slugify } from "@/lib/constants";

export function PublicHeader() { return <><header className="mast"><div className="container mast-inner"><Link href="/" className="brand">Nachrichten<span>blick</span></Link><div className="mast-actions"><Link href="/suche">Suche</Link><Link href="/admin/login">Redaktion</Link></div></div></header><nav className="nav"><div className="container nav-inner">{categories.map(category=><Link key={category} href={`/kategorie/${slugify(category)}`}>{category}</Link>)}</div></nav></>; }
export function PublicFooter() { return <footer className="footer"><div className="container footer-inner"><strong>Nachrichtenblick</strong><div><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/admin/login">Redaktion</Link></div></div></footer>; }
