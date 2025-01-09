require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


// Routes

// Users Routes
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'customer']
    );
    res.status(201).json({ success: true, message: 'User registered successfully!', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Email already registered.' });
    } else {
      res.status(500).json({ success: false, message: 'Database error.', error });
    }
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];
    res.status(200).json({ success: true, message: 'Login successful.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.', error });
  }
});

// Services Routes
app.get('/api/services', async (req, res) => {
  try {
    const [services] = await pool.execute('SELECT * FROM services');
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.', error });
  }
});

app.post('/api/services', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Service name is required.' });
  }

  try {
    await pool.execute('INSERT INTO services (name, description) VALUES (?, ?)', [name, description || null]);
    res.status(201).json({ success: true, message: 'Service added successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Service already exists.' });
    } else {
      res.status(500).json({ success: false, message: 'Database error.', error });
    }
  }
});

// Appointments Routes
app.get('/api/appointments', async (req, res) => {
  try {
    const [appointments] = await pool.execute(`
      SELECT a.*, u.name AS user_name, s.name AS service_name
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
    `);
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.', error });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { user_id, name, phone, email, appointment_date, appointment_time, service_id, message } = req.body;
  if (!name || !phone || !email || !appointment_date || !service_id) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
  }

  try {
    await pool.execute(
      `INSERT INTO appointments (user_id, name, phone, email, appointment_date, appointment_time, service_id, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, name, phone, email, appointment_date, appointment_time || null, service_id, message || null]
    );
    res.status(201).json({ success: true, message: 'Appointment created successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.', error });
  }
});

// Logs Routes
app.post('/api/logs', async (req, res) => {
  const { user_id, action } = req.body;
  if (!user_id || !action) {
    return res.status(400).json({ success: false, message: 'User ID and action are required.' });
  }

  try {
    await pool.execute('INSERT INTO logs (user_id, action) VALUES (?, ?)', [user_id, action]);
    res.status(201).json({ success: true, message: 'Log entry created successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});