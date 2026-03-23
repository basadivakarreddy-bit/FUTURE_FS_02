const express = require('express');
const cors = require('cors');
const Papa = require('papaparse');
const auth = require('./auth');
const leads = require('./leads');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', auth.router);
app.use('/api/leads', leads);

// CSV Export
app.get('/api/export', (req, res) => {
    const db = require('./db');
    try {
        const leads = db.prepare('SELECT * FROM leads').all();
        if (leads.length === 0) return res.status(404).send('No leads to export');
        
        const csv = Papa.unparse(leads);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.status(200).send(csv);
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
