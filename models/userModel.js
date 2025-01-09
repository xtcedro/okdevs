const pool = require('../config/db'); // Import the database connection pool

const userModel = {
  /**
   * Get a user by ID.
   * @param {number} id - The user ID.
   */
  getUserById: async (id) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [user] = await pool.execute(query, [id]);
    return user.length ? user[0] : null;
  },

  /**
   * Get a user by email.
   * @param {string} email - The user email.
   */
  getUserByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [user] = await pool.execute(query, [email]);
    return user.length ? user[0] : null;
  },

  /**
   * Create a new user.
   * @param {object} data - User details.
   */
  createUser: async (data) => {
    const { name, email, password, role } = data;
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [name, email, password, role || 'customer']);
    return result.insertId;
  },

  /**
   * Update a user by ID.
   * @param {number} id - The user ID.
   * @param {object} data - Updated user details.
   */
  updateUser: async (id, data) => {
    const { name, email, password, role, phone, address } = data;
    const query = `
      UPDATE users 
      SET name = ?, email = ?, password = ?, role = ?, phone = ?, address = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name,
      email,
      password,
      role || 'customer',
      phone || null,
      address || null,
      id,
    ]);

    return result.affectedRows > 0;
  },

  /**
   * Delete a user by ID.
   * @param {number} id - The user ID.
   */
  deleteUser: async (id) => {
    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = userModel;