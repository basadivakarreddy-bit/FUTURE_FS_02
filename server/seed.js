const db = require('./db');
const bcrypt = require('bcryptjs');

const seed = () => {
  try {
    // Add Admin
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT OR IGNORE INTO users (username, email, password, source) VALUES (?, ?, ?, ?)').run(
      'divakar', 'admin@example.com', hashedPassword, 'Direct'
    );

    // Add Sample Leads
    const leads = [
      ['John Doe', 'john@example.com', '1234567890', 'Google Search', 'New', 'Interested in CRM'],
      ['Jane Smith', 'jane@example.com', '0987654321', 'Social Media', 'Contacted', 'Called on Monday'],
      ['Bob Wilson', 'bob@example.com', '5556667777', 'Referral', 'Converted', 'Deal closed!'],
      ['Alice Brown', 'alice@example.com', '1112223333', 'Manual Entry', 'New', 'Follow up next week']
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO leads (name, email, phone, source, status, notes) VALUES (?, ?, ?, ?, ?, ?)');
    leads.forEach(lead => stmt.run(...lead));

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

seed();
