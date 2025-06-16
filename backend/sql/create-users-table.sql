
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create default admin user
INSERT INTO users (username, password, email, role, active)
VALUES ('admin', '$2b$10$X/QQDHpNbEfbDOu8vNZQo.LnYIAc5qpoDHrDCZ5FgYP.KQ4jHzWXa', 'admin@coffeelab.gr', 'admin', true)
ON CONFLICT (username) DO NOTHING;
