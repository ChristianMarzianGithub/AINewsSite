-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "articleType" TEXT NOT NULL DEFAULT 'NACHRICHT',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "imageCaption" TEXT,
    "imageCredit" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "disclosureEnabled" BOOLEAN NOT NULL DEFAULT false,
    "claimsToVerify" TEXT NOT NULL DEFAULT '[]',
    "personaId" TEXT,
    "researchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "Article_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Article_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "ResearchSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "background" TEXT NOT NULL DEFAULT '',
    "politicalOrientation" TEXT NOT NULL DEFAULT '',
    "values" TEXT NOT NULL DEFAULT '',
    "writingStyle" TEXT NOT NULL DEFAULT '',
    "perspective" TEXT NOT NULL DEFAULT '',
    "instructions" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ResearchSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "questions" TEXT NOT NULL DEFAULT '',
    "depth" TEXT NOT NULL DEFAULT 'STANDARD',
    "timeRange" TEXT NOT NULL DEFAULT '7d',
    "geographicFocus" TEXT NOT NULL DEFAULT 'Deutschland',
    "summary" TEXT NOT NULL DEFAULT '',
    "conflicts" TEXT NOT NULL DEFAULT '[]',
    "missingInfo" TEXT NOT NULL DEFAULT '[]',
    "timeline" TEXT NOT NULL DEFAULT '[]',
    "perspectives" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "model" TEXT,
    "liveSearch" BOOLEAN NOT NULL DEFAULT false,
    "searchedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ResearchSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "researchSessionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "retrievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT NOT NULL DEFAULT '',
    "sourceType" TEXT NOT NULL DEFAULT 'Web',
    "included" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "ResearchSource_researchSessionId_fkey" FOREIGN KEY ("researchSessionId") REFERENCES "ResearchSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResearchFact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "researchSessionId" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResearchFact_researchSessionId_fkey" FOREIGN KEY ("researchSessionId") REFERENCES "ResearchSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FactSource" (
    "factId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "relation" TEXT NOT NULL DEFAULT 'SUPPORTS',

    PRIMARY KEY ("factId", "sourceId"),
    CONSTRAINT "FactSource_factId_fkey" FOREIGN KEY ("factId") REFERENCES "ResearchFact" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FactSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ResearchSource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleSource" (
    "articleId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,

    PRIMARY KEY ("articleId", "sourceId"),
    CONSTRAINT "ArticleSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ResearchSource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResearchNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "researchSessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ResearchNote_researchSessionId_fkey" FOREIGN KEY ("researchSessionId") REFERENCES "ResearchSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleRevision_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Article_category_status_idx" ON "Article"("category", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_name_key" ON "Persona"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchSource_researchSessionId_url_key" ON "ResearchSource"("researchSessionId", "url");
