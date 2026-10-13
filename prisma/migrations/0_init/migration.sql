-- EMICODE Neon PostgreSQL Initial Migration
-- Creates projects, admins, services, contact_requests, profile tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: projects
CREATE TABLE IF NOT EXISTS "projects" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL UNIQUE,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "technologies" TEXT[] NOT NULL DEFAULT '{}',
    "coverImage" TEXT NOT NULL,
    "gallery" TEXT[] NOT NULL DEFAULT '{}',
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'completed',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_projects_category" ON "projects"("category");
CREATE INDEX IF NOT EXISTS "idx_projects_featured" ON "projects"("featured");
CREATE INDEX IF NOT EXISTS "idx_projects_sort" ON "projects"("sortOrder");

-- Table: admins
CREATE TABLE IF NOT EXISTS "admins" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: services
CREATE TABLE IF NOT EXISTS "services" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- Table: contact_requests
CREATE TABLE IF NOT EXISTS "contact_requests" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "serviceType" VARCHAR(100) NOT NULL,
    "budget" VARCHAR(100),
    "message" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_contacts_status" ON "contact_requests"("status");
CREATE INDEX IF NOT EXISTS "idx_contacts_created" ON "contact_requests"("createdAt" DESC);

-- Table: profile
CREATE TABLE IF NOT EXISTS "profile" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "displayName" VARCHAR(255) NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "whatsapp" VARCHAR(100) NOT NULL,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "resumeUrl" TEXT
);
