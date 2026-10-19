import { login } from "@/app/actions";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}) { if(await isAdmin()) redirect("/admin"); const error=(await searchParams).error; return <main className="container"><div className="panel login"><div className="brand" style={{color:"#092441"}}>Nachrichten<span>blick</span></div><h1>Redaktion anmelden</h1><p className="muted">Geschützter Bereich für Redaktion und Recherche.</p>{error && <div className="notice">Passwort ungültig oder Anmeldung vorübergehend gesperrt.</div>}<form action={login} className="form"><label>Administratorpasswort<input type="password" name="password" required autoComplete="current-password"/></label><button className="btn">Anmelden</button></form></div></main>; }
