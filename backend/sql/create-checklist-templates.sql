
-- Create checklist_templates table
CREATE TABLE IF NOT EXISTS checklist_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sections JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample checklist template
INSERT INTO checklist_templates (title, description, sections, active)
VALUES (
  'Έλεγχος Καταστήματος',
  'Πρότυπο ελέγχου καταστήματος Coffee Lab',
  '[
    {
      "title": "Καθαριότητα",
      "items": [
        {"text": "Καθαρά τραπέζια", "type": "checkbox"},
        {"text": "Καθαρό πάτωμα", "type": "checkbox"},
        {"text": "Καθαρές τουαλέτες", "type": "checkbox"},
        {"text": "Σχόλια", "type": "text"}
      ]
    },
    {
      "title": "Εξυπηρέτηση",
      "items": [
        {"text": "Χρόνος αναμονής", "type": "rating", "max": 5},
        {"text": "Ευγένεια προσωπικού", "type": "rating", "max": 5},
        {"text": "Γνώση προϊόντων", "type": "rating", "max": 5},
        {"text": "Σχόλια", "type": "text"}
      ]
    },
    {
      "title": "Ποιότητα Προϊόντων",
      "items": [
        {"text": "Καφές", "type": "rating", "max": 5},
        {"text": "Γλυκά", "type": "rating", "max": 5},
        {"text": "Αλμυρά", "type": "rating", "max": 5},
        {"text": "Σχόλια", "type": "text"}
      ]
    }
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;
