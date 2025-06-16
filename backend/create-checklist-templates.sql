-- Create checklist_templates table
CREATE TABLE IF NOT EXISTS "checklist_templates" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "sections" JSON NOT NULL,
  "created_by" INTEGER,
  "active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);