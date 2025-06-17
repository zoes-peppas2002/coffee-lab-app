const express = require("express");
const router = express.Router();

// Get the appropriate pool based on environment
let pool;
if (process.env.NODE_ENV === 'production') {
  pool = require("../db-pg");
  console.log('Users route using PostgreSQL database');
} else {
  pool = require("../db");
  console.log('Users route using MySQL database');
}

// Helper function to convert MySQL-style queries to PostgreSQL-style
function pgQuery(query, params = []) {
  // Replace ? with $1, $2, etc.
  let pgQuery = query;
  let paramCount = 0;
  pgQuery = pgQuery.replace(/\?/g, () => `$${++paramCount}`);
  
  return { query: pgQuery, params };
}

// Helper function to execute query based on environment
async function executeQuery(query, params = []) {
  if (process.env.NODE_ENV === 'production') {
    // PostgreSQL query
    const { query: pgSql, params: pgParams } = pgQuery(query, params);
    const result = await pool.query(pgSql, pgParams);
    return [result.rows, result.fields];
  } else {
    // MySQL query
    return await pool.query(query, params);
  }
}

// GET: Φέρνουμε όλους τους χρήστες
router.get("/", async (req, res) => {
  try {
    const [rows] = await executeQuery("SELECT id, name, email, role, password FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Προσθήκη νέου χρήστη
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    await executeQuery(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT: Επεξεργασία χρήστη
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    await executeQuery(
      "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?",
      [name, email, password, role, id]
    );
    res.json({ message: "User updated" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE: Διαγραφή χρήστη
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await executeQuery("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Φέρνουμε χρήστες με συγκεκριμένο ρόλο
router.get("/by-role/:role", async (req, res) => {
  const { role } = req.params;
  try {
    const [rows] = await executeQuery(
      "SELECT id, name, email, role FROM users WHERE role = ?",
      [role]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Received login:", email, password); // 🔍 για debug

    const [rows] = await executeQuery(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?",
      [email.trim().toLowerCase(), password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
