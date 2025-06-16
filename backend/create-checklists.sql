-- Create checklists table
CREATE TABLE IF NOT EXISTS "checklists" (
  "id" SERIAL PRIMARY KEY,
  "template_id" INTEGER NOT NULL,
  "store_id" INTEGER NOT NULL,
  "completed_by" INTEGER NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "responses" JSON NOT NULL,
  "score" FLOAT,
  "pdf_path" VARCHAR(255),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);