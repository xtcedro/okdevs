const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); // Import database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.join(__dirname, '../../html/public')));

// Test route
app.get('/api', (req, res) => {
  res.send('API is working!');
});

// Appointment submission endpoint
app.post('/api/appointments', (req, res) => {
  const { name, phone, email, appointment_date, appointment_time, service, message } = req.body;

  // Validate required fields
  if (!name || !phone || !email || !appointment_date || !appointment_time || !service) {
    return res.status(400).send('All fields are required.');
  }

  const sql = `INSERT INTO appointments (name, phone, email, appointment_date, appointment_time, service, message)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, phone, email, appointment_date, appointment_time, service, message || null], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error saving appointment.');
    }
    res.status(200).send('Appointment booked successfully!');
  });
});

// Fetch all appointments
app.get('/api/appointments', (req, res) => {
  const sql = `SELECT * FROM appointments ORDER BY appointment_date ASC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).send('Error fetching appointments.');
    }
    res.status(200).json(results); // Send the appointments as JSON
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});