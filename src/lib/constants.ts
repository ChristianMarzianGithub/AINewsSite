export const categories = ["Politik", "Wirtschaft", "Deutschland", "Ausland", "Wissenschaft", "Technologie", "Gesellschaft", "Meinung"] as const;
export const articleTypes = ["Nachricht", "Analyse", "Hintergrund", "Kommentar", "Meinung"] as const;
export const statuses = ["GENERATED", "DRAFT", "APPROVED", "PUBLISHED", "REJECTED"] as const;
export function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}
export function dateDE(value?: Date | string | null) {
  return value ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "–";
}
export function parseList(value: string | null | undefined): string[] {
  try { const parsed: unknown = JSON.parse(value ?? "[]"); return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []; } catch { return []; }
}
