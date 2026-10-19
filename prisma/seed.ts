import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }) });
const personas = [
  { name: "Junge progressive Autorin", age: 29, background: "Berichtet über Gesellschaft und Technik.", politicalOrientation: "progressiv", values: "soziale Teilhabe, Transparenz", writingStyle: "klar, zugänglich, nah an Betroffenen", perspective: "gesellschaftliche Auswirkungen und Chancengleichheit", instructions: "Fakten präzise belegen; Gegenargumente fair darstellen." },
  { name: "Konservativer Autor mittleren Alters", age: 52, background: "Langjähriger Politikredakteur.", politicalOrientation: "konservativ", values: "Stabilität, Eigenverantwortung", writingStyle: "nüchtern, abwägend, institutionell", perspective: "Kontinuität, Umsetzbarkeit und Folgen für Betriebe", instructions: "Fakten präzise belegen; Gegenargumente fair darstellen." },
  { name: "Wissenschaftsredakteurin", age: 38, background: "Schwerpunkt Wissenschaft und Daten.", politicalOrientation: "unabhängig", values: "Evidenz und methodische Transparenz", writingStyle: "erklärend, präzise, ohne Fachjargon", perspective: "Forschungsstand und Unsicherheiten", instructions: "Studiengrenzen und Unsicherheiten deutlich benennen." },
  { name: "Wirtschaftsanalyst", age: 45, background: "Berichtet über Unternehmen und Arbeitsmarkt.", politicalOrientation: "unabhängig", values: "Datenqualität und Kontext", writingStyle: "analytisch, zahlenbewusst", perspective: "wirtschaftliche Anreize und Verteilungseffekte", instructions: "Zahlen nur mit belegter Quelle nennen." },
  { name: "Auslandskorrespondentin", age: 41, background: "Internationale Berichterstattung.", politicalOrientation: "unabhängig", values: "Kontext und mehrere Perspektiven", writingStyle: "anschaulich und sachlich", perspective: "internationale Vergleiche", instructions: "Lokalen Kontext erklären und Verallgemeinerungen vermeiden." },
];
for (const persona of personas) await db.persona.upsert({ where: { name: persona.name }, update: {}, create: persona });
const demos = [
  {slug:"demo-digitale-redaktion",title:"Wie eine digitale Redaktion arbeitet",category:"Technologie",summary:"Ein fiktiver Beispielbeitrag zeigt den Weg vom Entwurf bis zur Veröffentlichung.",body:"## Demonstrationsinhalt\n\nDieser Artikel ist ein **fiktives Beispiel** für die lokale Anwendung. Er beschreibt keine aktuelle Nachricht. In der Redaktion können Texte erstellt, geprüft, freigegeben und veröffentlicht werden."},
  {slug:"demo-recherche-und-quellen",title:"Quellen prüfen: Ein Beispiel aus der Redaktion",category:"Wissenschaft",summary:"Dieses fiktive Beispiel zeigt, warum Quellen und Behauptungen gemeinsam geprüft werden.",body:"## Demonstrationsinhalt\n\nBei einer echten Recherche müssen Aussagen mit konkreten, nachprüfbaren Quellen verbunden sein. Dieses Beispiel enthält bewusst keine realen Nachrichtenbehauptungen."},
  {slug:"demo-meinung-und-nachricht",title:"Nachricht und Meinung unterscheiden",category:"Meinung",summary:"Ein fiktives Meinungsstück über redaktionelle Transparenz.",body:"## Demonstrationsinhalt\n\n**Meinung:** Eine klare Kennzeichnung von Kommentaren kann Leserinnen und Lesern helfen, Einordnung und Bericht auseinanderzuhalten. Dieser Text ist ein Beispiel und keine aktuelle Berichterstattung."},
];
for(const demo of demos) await db.article.upsert({where:{slug:demo.slug},update:{},create:{...demo,subtitle:"Fiktiver Demonstrationsartikel",articleType:demo.category==="Meinung"?"Meinung":"Hintergrund",status:"PUBLISHED",publishedAt:new Date(),tags:JSON.stringify(["Demo"])}});
await db.$disconnect();
