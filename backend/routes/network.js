const express = require("express");
const router = express.Router();

// GET: Λίστα όλων των καταστημάτων με τους αντίστοιχους χρήστες
router.get("/", async (req, res) => {
  try {
    // Διαφορετικό query ανάλογα με το αν είμαστε σε MySQL ή PostgreSQL
    let rows;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      const result = await req.pool.query(`
        SELECT 
          id,
          name,
          address,
          city,
          phone,
          email,
          manager_name,
          active,
          created_at,
          updated_at
        FROM 
          network_stores
        ORDER BY 
          name
      `);
      rows = result.rows;
    } else {
      // MySQL query
      [rows] = await req.pool.query(`
        SELECT 
          id,
          name,
          address,
          city,
          phone,
          email,
          manager_name,
          active,
          created_at,
          updated_at
        FROM 
          network_stores
        ORDER BY 
          name
      `);
    }
    
    res.json(rows);
  } catch (err) {
    console.error("Error fetching network stores:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Προσθήκη νέου καταστήματος στο δίκτυο
router.post("/", async (req, res) => {
  const { name, address, city, phone, email, manager_name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Store name is required" });
  }
  
  if (!address) {
    return res.status(400).json({ error: "Store address is required" });
  }
  
  if (!city) {
    return res.status(400).json({ error: "Store city is required" });
  }
  
  try {
    console.log("Προσθήκη νέου καταστήματος:", { name, address, city, phone, email, manager_name });
    
    // Διαφορετικό query ανάλογα με το αν είμαστε σε MySQL ή PostgreSQL
    let storeId;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      const result = await req.pool.query(`
        INSERT INTO network_stores 
        (name, address, city, phone, email, manager_name, active, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING id
      `, [name, address, city, phone || null, email || null, manager_name || null]);
      
      storeId = result.rows[0].id;
    } else {
      // MySQL query
      const [result] = await req.pool.query(`
        INSERT INTO network_stores 
        (name, address, city, phone, email, manager_name, active, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, true, NOW(), NOW())
      `, [name, address, city, phone || null, email || null, manager_name || null]);
      
      storeId = result.insertId;
    }
    
    console.log("Το κατάστημα προστέθηκε στον πίνακα network_stores με ID:", storeId);
    
    res.status(201).json({ 
      message: "Network store added successfully", 
      id: storeId 
    });
  } catch (err) {
    console.error("Error adding network store:", err);
    
    // Πιο λεπτομερής χειρισμός σφαλμάτων
    if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
      return res.status(400).json({ error: "Υπάρχει ήδη κατάστημα με αυτό το όνομα" });
    } else {
      return res.status(500).json({ error: "Σφάλμα κατά την προσθήκη του καταστήματος: " + err.message });
    }
  }
});

// PUT: Ενημέρωση καταστήματος στο δίκτυο
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, city, phone, email, manager_name, active } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Store name is required" });
  }
  
  if (!address) {
    return res.status(400).json({ error: "Store address is required" });
  }
  
  if (!city) {
    return res.status(400).json({ error: "Store city is required" });
  }
  
  try {
    // Έλεγχος αν υπάρχει το κατάστημα
    let storeExists = false;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      const result = await req.pool.query(`
        SELECT EXISTS(SELECT 1 FROM network_stores WHERE id = $1)
      `, [id]);
      storeExists = result.rows[0].exists;
    } else {
      // MySQL query
      const [result] = await req.pool.query(`
        SELECT COUNT(*) as count FROM network_stores WHERE id = ?
      `, [id]);
      storeExists = result[0].count > 0;
    }
    
    if (!storeExists) {
      return res.status(404).json({ error: "Network store not found" });
    }
    
    // Ενημέρωση του καταστήματος
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      await req.pool.query(`
        UPDATE network_stores 
        SET name = $1, address = $2, city = $3, phone = $4, email = $5, manager_name = $6, 
            active = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
      `, [name, address, city, phone || null, email || null, manager_name || null, 
          active !== undefined ? active : true, id]);
    } else {
      // MySQL query
      await req.pool.query(`
        UPDATE network_stores 
        SET name = ?, address = ?, city = ?, phone = ?, email = ?, manager_name = ?, 
            active = ?, updated_at = NOW()
        WHERE id = ?
      `, [name, address, city, phone || null, email || null, manager_name || null, 
          active !== undefined ? active : true, id]);
    }
    
    res.json({ message: "Network store updated successfully" });
  } catch (err) {
    console.error("Error updating network store:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE: Διαγραφή καταστήματος από το δίκτυο
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    // Έλεγχος αν υπάρχει το κατάστημα
    let storeExists = false;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      const result = await req.pool.query(`
        SELECT EXISTS(SELECT 1 FROM network_stores WHERE id = $1)
      `, [id]);
      storeExists = result.rows[0].exists;
    } else {
      // MySQL query
      const [result] = await req.pool.query(`
        SELECT COUNT(*) as count FROM network_stores WHERE id = ?
      `, [id]);
      storeExists = result[0].count > 0;
    }
    
    if (!storeExists) {
      return res.status(404).json({ error: "Network store not found" });
    }
    
    // Διαγραφή του καταστήματος
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      await req.pool.query(`DELETE FROM network_stores WHERE id = $1`, [id]);
    } else {
      // MySQL query
      await req.pool.query(`DELETE FROM network_stores WHERE id = ?`, [id]);
    }
    
    res.json({ message: "Network store deleted successfully" });
  } catch (err) {
    console.error("Error deleting network store:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
