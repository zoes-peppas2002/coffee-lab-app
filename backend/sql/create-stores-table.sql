
-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  network_id INTEGER REFERENCES network(id),
  address VARCHAR(255),
  city VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample store data
INSERT INTO stores (name, network_id, address, city, active)
VALUES 
  ('Σύνταγμα 1', 1, 'Πλατεία Συντάγματος 10', 'Αθήνα', true),
  ('Ομόνοια 1', 2, 'Πλατεία Ομονοίας 5', 'Αθήνα', true),
  ('Μοσχάτο 1', 3, 'Πειραιώς 74', 'Αθήνα', true),
  ('Σοφοκλέους 1', 4, 'Σοφοκλέους 15', 'Αθήνα', true)
ON CONFLICT DO NOTHING;
