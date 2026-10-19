# Repository Guidelines

## Project Structure & Module Organization

AINewsSite is currently a starter repository. The root contains `README.md` (project name) and `LICENSE` (MIT); there is no application source, test suite, asset directory, or dependency manifest yet. When adding an application, keep source, tests, and static assets in clearly named directories and document the chosen layout in `README.md`. Place tests near the code they cover or in a dedicated `tests/` directory, and use one approach consistently.

## Build, Test, and Development Commands

No build, run, lint, or test commands are configured yet. Do not assume `npm`, Maven, or another toolchain is available. Before introducing code, add the appropriate dependency manifest and scripts, then document exact setup and execution commands in `README.md`. For the current repository, `git status --short` checks local changes, and `git diff --check` detects whitespace errors before a commit.

## Coding Style & Naming Conventions

There is no established programming language, formatter, or linter. Follow the conventions of the language and framework selected for the first implementation, and commit formatter and linter configuration with that code. Keep names descriptive and consistent within each language. For Markdown, use descriptive headings, short paragraphs, and fenced code blocks for commands; preserve the existing top-level `README.md` and `LICENSE` names.

## Testing Guidelines

No testing framework or coverage threshold is configured. Add tests with the first behavior-bearing feature and document how to run them. Name test files according to the selected framework, group tests by the component or behavior they verify, and include a regression test when fixing a bug. Run the relevant tests and `git diff --check` before opening a pull request.

## Commit & Pull Request Guidelines

The Git history contains only `Initial commit`, so it does not establish a detailed commit convention. Use short, imperative commit subjects that describe the change. Keep pull requests focused; describe the purpose, key changes, and verification performed. Link an issue when one exists, and include screenshots for visible UI changes. Update `README.md` whenever setup or development commands change.

## Security & Configuration

Do not commit secrets, credentials, or local environment files. If configuration becomes necessary, provide a safe example file and document required variables in `README.md`.



#Initial prompt
# ONE-SHOT PROJECT: AI News Website, Research Assistant and Editorial CMS

You are a principal full-stack engineer, experienced UI/UX designer, and AI application architect.

Build a complete, locally runnable German-language news publishing platform inspired by the layout and editorial quality of tagesschau.de.

The application must combine:

1. A professional public news website
2. A password-protected editorial CMS
3. An AI-powered internet research assistant
4. A source and fact management system
5. Configurable fictional author personalities
6. AI-assisted article generation
7. Human-controlled article review, approval, and publication

This is a ONE-SHOT implementation task.

Do not ask questions.
Do not stop after creating a plan.
Do not provide pseudocode instead of implementation.
Do not skip major features.
Make reasonable decisions independently.
Create the actual project, source files, database schema, API routes, tests, and documentation.

You may install dependencies and execute local development commands.

Prioritize a fully integrated, working MVP over unnecessary complexity.

---

# 1. Technology Stack

Use:

- Next.js with App Router
- TypeScript with strict typing
- Tailwind CSS
- shadcn/ui for reusable UI components
- Lucide icons
- SQLite
- Prisma ORM
- Official OpenAI Node.js SDK
- OpenAI Responses API
- OpenAI web_search tool
- Zod for input and response validation
- Secure password-based administrator authentication
- Markdown editor with preview, or a lightweight rich-text editor

Use the currently stable and mutually compatible package versions.

Keep infrastructure minimal.

No Docker requirement.
No cloud database.
No Kubernetes.
No microservices.
No paid news data API dependency.
No public user accounts.

The application must run locally using npm.

Use a modular structure with clear separation of UI, services, persistence, and AI logic.

---

# 2. General Concept

The application is a news website called:

"Nachrichtenblick"

Its public-facing appearance should be inspired by tagesschau.de, but with original branding.

Use a professional editorial design:

- Dark-blue and white color palette
- Strong headline typography
- Large featured stories
- Clear content hierarchy
- Category navigation
- Clean news article cards
- Professional article reading pages
- Responsive desktop and mobile layouts
- Publication timestamps
- Attractive admin interface

Do not use Tagesschau trademarks, logos, copyrighted articles, or copied design assets.

Everything visible to readers or administrators should be in German.

---

# 3. Public News Website

Implement these routes:

- `/` — Homepage
- `/artikel/[slug]` — Article detail
- `/kategorie/[slug]` — Category view
- `/suche` — Search
- `/impressum` — Legal placeholder
- `/datenschutz` — Privacy placeholder

Categories:

- Politik
- Wirtschaft
- Deutschland
- Ausland
- Wissenschaft
- Technologie
- Gesellschaft
- Meinung

Articles support:

- Title
- Subtitle
- Summary
- Full article body
- Category
- Tags
- Author display name
- Author persona reference
- Article type
- Publication timestamp
- Featured status
- Optional article image
- Optional caption and image credit
- Related articles
- Source references
- AI assistance disclosure

Article types:

- Nachricht
- Analyse
- Hintergrund
- Kommentar
- Meinung

Clearly distinguish opinion journalism from factual news reporting.

Only published articles appear publicly.

Display linked sources at the bottom of articles, with accessible source titles and URLs.

Do not imply a claim was independently verified unless that verification actually happened.

---

# 4. Admin Authentication

Create:

`/admin/login`

Authentication requirements:

- Single administrator
- Password stored in environment variable
- Server-side password verification
- Secure HTTP-only session cookies
- Session expiration
- Logout
- Authorization checks on every protected backend operation
- Rate limiting for login attempts
- CSRF protection for state-changing requests
- Production-safe cookie settings

Environment variables:

ADMIN_PASSWORD=
SESSION_SECRET=

Never expose credentials client-side.

Do not build fake authentication with localStorage.

---

# 5. Editorial Admin Dashboard

Create:

`/admin`

Use a sidebar layout with:

- Dashboard
- Articles
- Create Article
- AI Research
- Research Library
- AI Article Generator
- Author Personas
- Settings

Show dashboard statistics:

- Published articles
- Draft articles
- Articles awaiting approval
- Research sessions
- Recently edited articles
- AI-generated drafts

Include quick actions:

"Neuen Artikel erstellen"

"Thema recherchieren"

"KI-Artikel generieren"

The dashboard should look like a polished content management system.

---

# 6. AI RESEARCH ASSISTANT — CORE FEATURE

Build a dedicated research workspace:

`/admin/research`

This is one of the most important parts of the project.

The purpose is to research real-world developments before creating news articles.

The administrator should be able to provide a topic, initiate live research, inspect the sources, and create a research dossier that can be used for article generation.

## 6.1 Research Input Form

Include:

### Research Topic

A large text input.

Examples:

- Aktuelle Rentenpolitik der Bundesregierung
- Auswirkungen von KI auf deutsche Arbeitsplätze
- Wirtschaftliche Lage Deutschlands
- Entwicklungen im Ukrainekrieg
- Ausbau erneuerbarer Energien

### Research Questions

Optional multiline input.

Example:

- What happened?
- Who is affected?
- What are the economic consequences?
- What do supporters argue?
- What do critics argue?
- What are the latest figures?

### Research Depth

Options:

**Quick Research**
- Search a small number of sources
- Summarize essential facts
- Optimize for speed and cost

**Standard Research**
- Search multiple relevant sources
- Compare reporting
- Identify contradictions
- Extract key facts
- Build a structured research dossier

**Deep Research**
- Conduct a more thorough multi-step investigation
- Search for additional evidence
- Prefer primary documents
- Compare independent reporting
- Investigate disagreements
- Produce a more comprehensive dossier

Implement actual differences in search depth, effort, and limits, not merely different prompt labels.

### Time Range

Options:

- Last 24 hours
- Last 7 days
- Last 30 days
- Last 12 months
- Any date

For user-selected date ranges, distinguish publication dates from event dates.

Do not claim complete coverage of a period if search results are incomplete.

### Geographic Focus

Options:

- Germany
- Europe
- Worldwide
- Custom region

### Preferred Sources

Optional:

- Government publications
- Public broadcasters
- Academic publications
- Established newspapers
- Official statistics
- International organizations
- Custom websites

A user may also enter preferred domains.

Treat source preferences as research guidance, not as proof of trustworthiness.

### Start Research

Button:

"Recherche starten"

Show progress and loading states.

---

# 7. LIVE INTERNET RESEARCH INTEGRATION

Use the official OpenAI Responses API with its web_search tool.

Use the official SDK and the current supported syntax.

Example integration concept:

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await client.responses.create({
  model: process.env.OPENAI_RESEARCH_MODEL!,
  tools: [
    {
      type: "web_search",
      external_web_access: true,
    },
  ],
  input: researchPrompt,
});
```

Adapt this example to the installed SDK version and its current type definitions.

Requirements:

- Research must perform real web searches when enabled
- Do not simulate web research
- Do not rely solely on the model's pretrained knowledge
- Request source references from the model
- Extract actual source URLs and citation annotations from supported API response structures
- Do not invent citations or source URLs
- Preserve provenance between claims and source references
- Record when research happened
- Record whether live web searching occurred
- Never report a successful live search when no search was actually executed

If search is unavailable or fails:

- Show a clear error
- Allow retry
- Allow manually supplied sources
- Do not fabricate a completed research result

Use configurable model names:

OPENAI_RESEARCH_MODEL=
OPENAI_WRITING_MODEL=

Default to compatible, cost-conscious current models that support the required functionality.

Do not assume every model supports every research capability.

Configure research calls with sensible timeouts, bounded search budgets, and retry behavior.

Allow long-running research requests to show visible progress where supported by the chosen API and architecture.

Avoid unnecessarily expensive repeated searches.

---

# 8. RESEARCH RESULT PRESENTATION

After research completes, display a dedicated research result page:

`/admin/research/[id]`

The page must contain these sections.

## 8.1 Executive Summary

Provide a concise factual summary of what was found.

## 8.2 Key Facts

Display a structured list of findings.

Each finding should have:

- Claim
- Supporting sources
- Relevant dates
- Evidence notes
- Verification status

Verification status must distinguish:

- Supported by inspected evidence
- Reported by a source but not independently corroborated
- Conflicting evidence
- Unverified

Never classify a claim as verified merely because the language model is confident.

## 8.3 Timeline

When appropriate, generate a chronological timeline of events.

Include dates and source references.

Do not invent dates.

## 8.4 Different Perspectives

Summarize relevant perspectives, such as:

- Government position
- Opposition position
- Economic perspective
- Social perspective
- International perspective
- Expert interpretation

Only include perspectives relevant to the topic.

Separate sourced positions from analytical interpretation.

## 8.5 Conflicting Information

Identify:

- Contradictions between sources
- Unconfirmed numbers
- Disputed statements
- Conflicting interpretations
- Potentially outdated information

Make the differences visible to the administrator.

## 8.6 Missing Information

Provide a list of:

- Unanswered questions
- Missing sources
- Claims needing further verification
- Potential research gaps

## 8.7 Sources

Display source cards containing:

- Source title
- Publisher or domain
- URL
- Publication date, if known
- Retrieval date
- Short summary
- Related key facts
- Source type
- Verification notes

Include buttons:

"Quelle öffnen"

"Quelle ausschließen"

"Quelle einbeziehen"

"Erneut recherchieren"

Never manufacture a publisher, publication date, or article title when unavailable.

Do not treat search snippets as equivalent to full article verification.

---

# 9. RESEARCH LIBRARY

Create:

`/admin/research/library`

Store previous research sessions persistently.

Features:

- List past research
- Search by topic
- Filter by date
- Reopen research sessions
- Delete research
- Rename a research dossier
- Add manual research notes
- Link research to an article
- Rerun research to retrieve newer information

Store at least:

- Research topic
- Research questions
- Research depth
- Time range
- Geographic focus
- Summary
- Facts
- Sources
- Conflicts
- Missing information
- Research date
- Research model
- Status
- Article links

Research and article records must persist across application restarts.

---

# 10. SOURCE MANAGEMENT AND EDITORIAL CONTROL

The administrator should be able to:

- Add a source manually by URL
- Edit source metadata
- Exclude a source from article generation
- Add research notes
- Mark a claim as needing verification
- Approve or reject individual claims
- Inspect which source supports a claim

When a source is excluded, it must not be used as evidence in subsequent article generation.

A source URL is not proof that an article was read or verified.

If the system cannot access an article's full content, record this limitation.

Do not automatically scrape paywalled content.

Do not reproduce copyrighted news articles.

Use concise summaries, factual extraction, and attribution.

---

# 11. AUTHOR PERSONAS

Create:

`/admin/personas`

Author personas are fictional writing profiles that influence the framing, tone, style, and perspectives of an article.

Predefine:

### Conservative Middle-Aged Writer

- Approximately 55 years old
- Conservative political orientation
- Values stability, tradition, and personal responsibility
- Formal, pragmatic style
- Focuses on institutional stability, national interests, and economic responsibility

### Young Progressive Writer

- Approximately 24 years old
- Progressive / left-wing
- Values equality, social justice, and climate protection
- Energetic, critical writing
- Focuses on inequality and systemic problems

### Liberal Economist

- Approximately 40 years old
- Economically liberal
- Analytical, data-focused writing
- Emphasizes competition, markets, entrepreneurship, and innovation

### Neutral Journalist

- Professional and evidence-driven
- Clear separation of facts and interpretations
- Neutral tone
- Fair representation of relevant viewpoints

### Environmental Activist

- Approximately 30 years old
- Strong ecological worldview
- Focus on climate protection and sustainability
- Passionate but evidence-based writing

## Custom Persona Management

Allow creation, modification, and deletion of personas.

Fields:

- Name
- Optional age
- Background
- Political orientation
- Values
- Writing style
- Preferred framing
- Additional instructions

Store personas in the database.

Different personas should produce meaningfully different writing styles and interpretations.

IMPORTANT:

For factual news reports, persona preferences must never override evidence.

For opinion pieces, perspectives may differ, but factual claims must remain grounded.

Do not fabricate quotes, sources, or statistics to support an ideological viewpoint.

---

# 12. AI ARTICLE GENERATOR

Create:

`/admin/ai-generator`

The article generator should support two modes.

## Mode A: Research-Based Article

The recommended workflow.

The administrator selects an existing research dossier.

Then chooses:

- Author persona
- Article type
- Length
- Category
- Additional instructions
- Talking points
- Sources to include

The AI writes using the selected research.

Avoid introducing unsupported new factual claims.

Clearly identify the supplied research date.

## Mode B: Topic-Based Draft

The administrator can generate a preliminary draft using only the supplied topic and instructions.

This mode is useful for general or evergreen content.

However:

- Clearly display "Ohne aktuelle Recherche"
- Never represent it as verified breaking news
- Require editorial verification before publication
- Flag specific factual claims needing verification

Add an option:

"Vor dem Schreiben recherchieren"

When enabled, automatically perform a research step before article generation.

---

# 13. AI ARTICLE GENERATION SETTINGS

Provide:

### Topic

Free text.

### Talking Points

Multiline text area.

### Persona

Dropdown with available personas.

### Article Type

- Neutral News Report
- Analysis
- Background
- Commentary
- Opinion

### Article Length

- Short: 300 words
- Medium: 600 words
- Long: 1,000 words
- Very Long: 1,500 words

### Additional Instructions

Free-text field.

### Research Selection

Allow selecting a saved research dossier.

### Generate

Button:

"Artikelentwurf erstellen"

Use structured output with server-side validation.

Return:

- Headline
- Subtitle
- Summary
- Body
- Category
- Tags
- Article type
- Persona
- Related source IDs
- Claims needing verification

Use a writing prompt that emphasizes:

- Professional German journalism
- Correct grammar
- Natural writing style
- The selected author's perspective
- Factual consistency with the research
- Meaningful attribution
- Clear distinction between fact and opinion
- Avoidance of invented information
- Human-readable formatting

Do not fabricate direct quotations.

Do not present hypothetical statements as reported facts.

---

# 14. ARTICLE REVIEW WORKFLOW

After generation, open a review page.

The editor can:

- Read the complete generated draft
- Edit any section
- Change headline
- Change subheadline
- Modify article text
- Review source references
- Inspect claims needing verification
- Regenerate the draft
- Save the draft
- Reject it
- Approve it
- Publish it

Use these states:

GENERATED

DRAFT

APPROVED

PUBLISHED

REJECTED

Publishing must be a separate, explicit administrator action.

Never automatically publish AI-generated articles.

Rejected articles must not be visible publicly.

Regeneration must not silently overwrite manually edited content.

Record whether an article was AI-assisted.

---

# 15. ARTICLE EDITOR

Create manual article creation and editing views.

Features:

- Title input
- Subtitle input
- Summary input
- Markdown or rich-text editor
- Preview mode
- Category selector
- Tags
- Article type
- Persona assignment
- Upload image
- Featured article switch
- Source management
- Save draft
- Approve
- Publish
- Unpublish
- Delete with confirmation

Implement persistent saves.

Validate all inputs.

Prevent stored XSS from rendered article content.

---

# 16. DATABASE DESIGN

Use SQLite and Prisma.

Create appropriate models and relations.

At minimum:

## Article

- id
- slug
- title
- subtitle
- summary
- body
- category
- tags
- articleType
- status
- featured
- imageUrl
- imageCaption
- imageCredit
- aiGenerated
- disclosureEnabled
- personaId
- researchId
- createdAt
- updatedAt
- publishedAt

## Persona

- id
- name
- age
- background
- politicalOrientation
- values
- writingStyle
- perspective
- instructions
- createdAt
- updatedAt

## ResearchSession

- id
- title
- topic
- questions
- depth
- timeRange
- geographicFocus
- summary
- status
- model
- searchedAt
- createdAt
- updatedAt

## ResearchSource

- id
- researchSessionId
- title
- publisher
- url
- publishedAt
- retrievedAt
- summary
- sourceType
- included
- notes

## ResearchFact

- id
- researchSessionId
- claim
- verificationStatus
- notes
- createdAt

Implement a many-to-many relationship between facts and their supporting or conflicting sources.

## ResearchNote

- id
- researchSessionId
- content
- createdAt
- updatedAt

## ArticleRevision

- id
- articleId
- title
- body
- createdAt

Implement proper relations, indexes, and migrations.

Use sensible nullable fields and SQLite-compatible types.

Use JSON serialization where appropriate, with validated application-level types.

---

# 17. ARTICLE SOURCE ATTRIBUTION

Research-based articles should support source references.

Public article pages should contain a section:

"Quellen"

Include clickable external links.

Where useful, provide numbered inline source references.

Only use sources that are genuinely associated with the relevant claim.

Never generate fake references.

If an article contains unsupported claims, flag them in the admin editor.

Do not automatically imply that source inclusion means the article is independently fact-checked.

---

# 18. OPENAI CONFIGURATION

Use environment variables:

OPENAI_API_KEY=
OPENAI_RESEARCH_MODEL=
OPENAI_WRITING_MODEL=

Do not hardcode secrets.

Implement an admin settings page showing:

- Whether an API key is configured
- Selected research model
- Selected writing model
- Connection-test button
- Optional research limits
- Optional estimated usage information

Never show the full API key to the frontend.

The application must remain functional without an API key.

In that situation:

- Manual article editing works
- Public pages work
- Saved research can be inspected
- AI research is disabled
- AI generation is disabled
- Configuration instructions are displayed

Do not claim that a ChatGPT Plus subscription includes API usage.

API billing is separate.

---

# 19. COST MANAGEMENT

Research and generation may incur API charges.

Implement lightweight cost controls:

- Show when an operation uses the OpenAI API
- Display the configured research depth
- Set bounded search/research budgets
- Avoid duplicate generation requests
- Disable submit buttons during active requests
- Add sensible server-side concurrency limits
- Store token usage where the API provides it
- Store available web-search tool usage metadata
- Show cost estimates only when supported by known pricing data
- Clearly label estimates as estimates
- Avoid claiming precise costs when usage details are incomplete

Allow the administrator to configure an approximate maximum budget per research operation.

Since exact cost enforcement may not be supported by the API, distinguish local safeguards from provider-enforced spending limits.

---

# 20. DESIGN REQUIREMENTS

Make the application look finished.

Public site:

- Strong news portal visual identity
- High-quality header
- Category navigation
- Large lead story
- Responsive news card grid
- Comfortable article reading layout
- Clean typography
- Professional footer

Admin:

- Modern sidebar navigation
- Dashboard cards
- Well-designed forms
- Research source cards
- Research facts table
- Status indicators
- Persona selection cards
- Split-pane editor/preview where useful
- Clear loading states
- Error handling
- Confirmation dialogs
- Mobile-friendly layouts

Use shadcn/ui components where practical.

Do not build an ugly prototype.

---

# 21. SECURITY

Implement:

- Server-side input validation
- Secure administrator sessions
- Protected admin endpoints
- CSRF protection
- HTML sanitization
- Secure image uploads
- File size and type limits
- Safe database queries
- No API key leakage
- No secrets in logs
- Bounded AI requests
- SSRF-safe handling of manually supplied URLs
- Prompt-injection resistance for retrieved webpages and research content
- Separation of trusted system instructions from untrusted external content

Research data must be treated as untrusted information, not executable instructions.

Never allow instructions retrieved from webpages to modify application behavior or override the system's editorial rules.

---

# 22. TESTING

Add tests for:

- Administrator login
- Authorization
- Article CRUD
- Publishing workflow
- Persona CRUD
- Research persistence
- Source inclusion/exclusion
- Research-to-article linking
- AI response validation
- Missing API key behavior
- Failed web research
- Malformed citations
- Rejected draft behavior
- Claim-to-source relationships
- Prompt-injection handling
- Public article visibility

Mock OpenAI requests in automated tests.

Tests must run without making real paid API calls.

Run:

- Linting
- Type checking
- Tests
- Production build

Fix discovered failures.

---

# 23. SEED DATA

Provide:

- Five predefined author personas
- Several clearly labeled fictional demonstration articles
- Example research dossiers using local mock fixtures
- Example source and fact relationships

Do not use fabricated research dossiers that appear to describe verified real news.

Make demo content clearly identifiable and removable.

---

# 24. README AND SETUP

Create a detailed README with:

- Project overview
- Architecture overview
- Prerequisites
- Installation steps
- Environment configuration
- Database initialization
- Running the application
- Running tests
- Admin login
- Configuring OpenAI
- Running research
- Creating AI articles
- Publishing articles
- Known limitations
- Security considerations
- API billing explanation

Create `.env.example` with:

ADMIN_PASSWORD=
SESSION_SECRET=
OPENAI_API_KEY=
OPENAI_RESEARCH_MODEL=
OPENAI_WRITING_MODEL=
DATABASE_URL=

The application should start with:

npm install

npm run db:setup

npm run dev

Then:

http://localhost:3000

All services required for ordinary local use should run in the same project.

---

# 25. REQUIRED END-TO-END USER JOURNEY

The following scenario must work:

1. I start the application locally.
2. I open the public news homepage.
3. I navigate to `/admin/login`.
4. I log in using my administrator password.
5. I select "KI-Recherche".
6. I enter "Auswirkungen künstlicher Intelligenz auf den deutschen Arbeitsmarkt".
7. I select Standard Research.
8. I start a live research request.
9. The system searches the internet.
10. The system creates a research dossier with real source links.
11. I review the collected facts.
12. I exclude an unsuitable source.
13. I select "Artikel aus Recherche erstellen".
14. I choose the Young Progressive Writer persona.
15. I select an 800–1,000 word analysis.
16. The AI creates a draft based on the selected sources.
17. I inspect and modify the text.
18. I approve the draft.
19. I publish the article.
20. The article appears on the homepage.
21. Opening the article displays the text and its actual source references.
22. I can later edit or unpublish it.

The workflow must also support generating a differently framed article from the same research using the Conservative Middle-Aged Writer persona.

Both articles must remain grounded in the same research evidence even when their perspectives differ.

---

# 26. SCOPE PRIORITIES

If implementation complexity becomes a problem, prioritize in this order:

1. Runnable application
2. Database persistence
3. Authentication
4. Public news pages
5. Manual article management
6. Real OpenAI web research
7. Source collection and research dossiers
8. Persona management
9. AI article generation
10. Human review and publishing
11. Visual polish
12. Advanced convenience features

Do not omit the core research-to-article workflow.

Keep the architecture straightforward and maintainable.

Avoid unnecessary abstractions.

---

# 27. DEFINITION OF DONE

The project is complete only when:

- npm installation works
- Database setup works
- The homepage renders
- Admin login works
- Articles can be created, saved, and published
- Personas can be selected and customized
- Research sessions can be created and saved
- Live web research uses the actual OpenAI web search API
- Real source references are preserved
- Research dossiers show facts, disagreements, and missing information
- Research dossiers can be reused
- AI can generate articles from saved research
- The chosen persona influences the resulting writing
- Generated drafts require approval
- Articles can be edited, published, and unpublished
- The application works without an OpenAI key in manual mode
- Tests and TypeScript checks pass
- The production build passes
- README setup instructions are accurate

Never report functionality as working unless it has been implemented and checked.

If external credentials are missing, validate the integration with mocks and document precisely what requires live testing.

---

# 28. FINAL EXECUTION INSTRUCTION

Now implement the entire project.

Do not ask for confirmation.

Do not stop after outlining the architecture.

Do not leave core functionality as TODO comments.

Create files, install dependencies, initialize the database, implement routes, and wire the UI to the backend.

Run the tests and build.

Fix errors.

At the end, provide only:

1. A concise implementation summary
2. Commands to run the application
3. Environment variables I must configure
4. Any features that could not be verified
5. Any remaining limitations

Start coding immediately.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
