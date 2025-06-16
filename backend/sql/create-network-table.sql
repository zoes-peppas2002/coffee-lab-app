
-- Create network table
CREATE TABLE IF NOT EXISTS network (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample network data
INSERT INTO network (name, address, city, active)
VALUES 
  ('Σύνταγμα', 'Πλατεία Συντάγματος 10', 'Αθήνα', true),
  ('Ομόνοια', 'Πλατεία Ομονοίας 5', 'Αθήνα', true),
  ('Μοσχάτο', 'Πειραιώς 74', 'Αθήνα', true),
  ('Σοφοκλέους', 'Σοφοκλέους 15', 'Αθήνα', true)
ON CONFLICT DO NOTHING;
