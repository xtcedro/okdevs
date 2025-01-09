require('dotenv').config(); // Load environment variables
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST, // From .env
  user: process.env.DB_USER, // From .env
  password: process.env.DB_PASSWORD, // From .env
  database: process.env.DB_NAME, // From .env
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verify the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully!');
    connection.release();
  }
});

module.exports = db;
