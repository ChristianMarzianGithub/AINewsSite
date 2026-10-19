# Nachrichtenblick

Eine lokal laufende, deutschsprachige Nachrichtenplattform mit öffentlicher Website, geschützter Redaktion, SQLite-Datenbank sowie KI-Recherche und Artikelerstellung über die OpenAI API. Das Erscheinungsbild ist eigenständig; die mitgelieferten Demoartikel sind ausdrücklich fiktiv.

## Voraussetzungen

- Node.js 22 oder neuer und npm
- Für KI-Funktionen ein eigener OpenAI API-Schlüssel mit aktivierter API-Abrechnung. Ein ChatGPT-Abonnement deckt API-Nutzung nicht ab.

## Lokal starten

```bash
npm install
cp .env.example .env
# ADMIN_PASSWORD (mindestens 12 Zeichen) und SESSION_SECRET (mindestens 32 Zeichen) in .env setzen
npm run db:setup
npm run dev
```

Unter Windows PowerShell kann `Copy-Item .env.example .env` verwendet werden. Falls die PowerShell-Ausführungsrichtlinie `npm.ps1` blockiert, funktionieren dieselben Befehle mit `npm.cmd`. Die Website ist unter http://localhost:3000 erreichbar, die Anmeldung unter `/admin/login`.

## Konfiguration

| Variable | Zweck |
| --- | --- |
| `ADMIN_PASSWORD` | Passwort der einzigen Redaktion-Anmeldung |
| `SESSION_SECRET` | Signaturschlüssel für zwölfstündige HTTP-only-Sitzungen |
| `DATABASE_URL` | SQLite-Datei, standardmäßig `file:./dev.db` |
| `OPENAI_API_KEY` | Optionaler Schlüssel für Live-Recherche und Artikelentwürfe |
| `OPENAI_RESEARCH_MODEL` | OpenAI-Modell für Recherche |
| `OPENAI_WRITING_MODEL` | OpenAI-Modell für Artikelentwürfe |

Ohne API-Schlüssel bleiben öffentliche Seiten, Redaktion, manuelle Artikel und gespeicherte Recherchen nutzbar. KI-Aktionen sind deaktiviert.

## Redaktioneller Ablauf

Unter `/admin/research` wird eine Live-Recherche angelegt. Das Dossier enthält Quellen, Fakten, mögliche Widersprüche und offene Fragen. Quellen können ausgeschlossen oder manuell ergänzt werden. Aus einem Dossier lässt sich über `/admin/ai-generator` ein Artikelentwurf erstellen. Der Entwurf muss geprüft, freigegeben und anschließend ausdrücklich veröffentlicht werden. Nur veröffentlichte Artikel erscheinen öffentlich. Alternativ können Artikel unter `/admin/articles/new` von Hand erstellt werden.

Der Artikeltext wird als Markdown gespeichert und beim Anzeigen bereinigt. Externe Quellen sind als Links am Artikelende sichtbar. Quellenangaben und KI-Ausgaben ersetzen keine redaktionelle Überprüfung.

## Entwicklung

```bash
npm run dev          # Entwicklungsserver
npm run db:migrate   # Schemaänderungen als Migration erfassen
npm run db:setup     # Migrationen ausführen, Client generieren, Demos anlegen
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test             # Automatisierte Tests ohne bezahlte API-Aufrufe
npm run build        # Produktionsbuild
npm run ai:check     # Optionale Live-Websuche; kann API-Kosten verursachen
```

Die App nutzt Next.js App Router, TypeScript, Prisma und SQLite. Öffentliche Routen und Adminseiten liegen unter `src/app`, Daten- und KI-Logik unter `src/lib`, gemeinsame UI unter `src/components`, das Datenmodell unter `prisma/schema.prisma`.

## Grenzen und Sicherheit

Die Anmeldebegrenzung läuft im Arbeitsspeicher eines einzelnen Prozesses und ist für einen lokalen Einzeladministrator ausgelegt. Rechtliche Seiten sind Platzhalter und müssen vor einer öffentlichen Bereitstellung ergänzt werden. Bild-Uploads akzeptieren PNG, JPEG und WebP bis 5 MB; externe Bild-URLs sollten vor öffentlichem Einsatz redaktionell geprüft werden. Live-Websuche benötigt einen konfigurierten API-Schlüssel und verursacht mögliche Kosten; lokale Tests verwenden keine echten API-Aufrufe.
