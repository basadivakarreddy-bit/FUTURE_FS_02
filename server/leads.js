const express = require('express');
const db = require('./db');
const router = express.Router();

// Middleware to check auth (simplified for now)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // In a real app, verify JWT here. For simplicity, we'll assume valid if present.
  next();
};

// CRUD for Leads
router.get('/', (req, res) => {
  const { search = '', status = '' } = req.query;
  let query = 'SELECT * FROM leads WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ? OR status LIKE ? OR source LIKE ?)';
  const params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%` ];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC';
  
  try {
    const leads = db.prepare(query).all(...params);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  const { name, email, phone, source, status, notes } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO leads (name, email, phone, source, status, notes) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(name, email, phone, source, status || 'New', notes);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Lead with this email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  const { name, email, phone, source, status, notes } = req.body;
  const { id } = req.params;
  try {
    db.prepare(`
      UPDATE leads 
      SET name = ?, email = ?, phone = ?, source = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(name, email, phone, source, status, notes, id);
    res.json({ message: 'Lead updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics
router.get('/stats', (req, res) => {
    try {
        const total = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
        const statusCounts = db.prepare('SELECT status, COUNT(*) as count FROM leads GROUP BY status').all();
        
        // Activity by day (last 7 days)
        const activity = db.prepare(`
            SELECT date(created_at) as date, COUNT(*) as count 
            FROM leads 
            WHERE created_at >= date('now', '-7 days')
            GROUP BY date(created_at)
        `).all();

        const recentLeads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5').all();

        // Login Activity (last 7 days)
        const loginActivity = db.prepare(`
            SELECT date(login_at) as date, COUNT(*) as count 
            FROM logins 
            WHERE login_at >= date('now', '-7 days')
            GROUP BY date(login_at)
        `).all();

        const recentLogins = db.prepare('SELECT username, email, login_at FROM logins ORDER BY login_at DESC LIMIT 5').all();

        // Lead Sources
        const sourceCounts = db.prepare('SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC').all();

        // Funnel stats
        const contactedCount = statusCounts.find(s => s.status === 'Contacted')?.count || 0;
        const convertedCount = statusCounts.find(s => s.status === 'Converted')?.count || 0;

        res.json({ 
          total, 
          statusCounts, 
          activity, 
          recentLeads, 
          loginActivity, 
          recentLogins,
          sourceCounts,
          funnel: {
            total,
            contacted: contactedCount,
            converted: convertedCount
          }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
