"use client";

import { useFormStatus } from "react-dom";

export function ResearchSubmit() {
  const { pending } = useFormStatus();
  return <button className="btn" disabled={pending}>{pending ? "Recherche läuft …" : "Recherche starten"}</button>;
}
