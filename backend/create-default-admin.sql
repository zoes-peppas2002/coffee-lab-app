-- Insert default admin user if not exists
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`)
SELECT 'Admin', 'zp@coffeelab.gr', 'Zoespeppas2025!', 'admin', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `users` WHERE `email` = 'zp@coffeelab.gr'
);
