
-- Create checklists table
CREATE TABLE IF NOT EXISTS checklists (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES checklist_templates(id),
  store_id INTEGER REFERENCES stores(id),
  user_id INTEGER REFERENCES users(id),
  completed BOOLEAN DEFAULT false,
  responses JSONB,
  score INTEGER,
  max_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample checklist data
INSERT INTO checklists (template_id, store_id, user_id, completed, responses, score, max_score)
VALUES (
  1, 1, 1, true,
  '[
    {
      "title": "Καθαριότητα",
      "items": [
        {"text": "Καθαρά τραπέζια", "type": "checkbox", "value": true},
        {"text": "Καθαρό πάτωμα", "type": "checkbox", "value": true},
        {"text": "Καθαρές τουαλέτες", "type": "checkbox", "value": false},
        {"text": "Σχόλια", "type": "text", "value": "Οι τουαλέτες χρειάζονται καθάρισμα"}
      ]
    },
    {
      "title": "Εξυπηρέτηση",
      "items": [
        {"text": "Χρόνος αναμονής", "type": "rating", "max": 5, "value": 4},
        {"text": "Ευγένεια προσωπικού", "type": "rating", "max": 5, "value": 5},
        {"text": "Γνώση προϊόντων", "type": "rating", "max": 5, "value": 3},
        {"text": "Σχόλια", "type": "text", "value": "Πολύ καλή εξυπηρέτηση αλλά χρειάζεται περισσότερη εκπαίδευση στα προϊόντα"}
      ]
    },
    {
      "title": "Ποιότητα Προϊόντων",
      "items": [
        {"text": "Καφές", "type": "rating", "max": 5, "value": 5},
        {"text": "Γλυκά", "type": "rating", "max": 5, "value": 4},
        {"text": "Αλμυρά", "type": "rating", "max": 5, "value": 4},
        {"text": "Σχόλια", "type": "text", "value": "Εξαιρετικός καφές, τα γλυκά και τα αλμυρά πολύ καλά"}
      ]
    }
  ]'::jsonb,
  25, 30
)
ON CONFLICT DO NOTHING;
