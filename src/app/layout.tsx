import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Nachrichtenblick", description: "Nachrichten, Analysen und Hintergründe" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="de"><body>{children}</body></html>; }
