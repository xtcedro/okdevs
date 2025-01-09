const pool = require('../config/db'); // Import the database connection pool

const appointmentModel = {
  /**
   * Get all appointments with user and service details.
   */
  getAllAppointments: async () => {
    const query = `
      SELECT a.*, u.name AS user_name, s.name AS service_name
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
    `;
    const [appointments] = await pool.execute(query);
    return appointments;
  },

  /**
   * Get a single appointment by ID.
   * @param {number} id - The appointment ID.
   */
  getAppointmentById: async (id) => {
    const query = `
      SELECT a.*, u.name AS user_name, s.name AS service_name
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `;
    const [appointment] = await pool.execute(query, [id]);
    return appointment.length ? appointment[0] : null;
  },

  /**
   * Create a new appointment.
   * @param {object} data - Appointment details.
   */
  createAppointment: async (data) => {
    const {
      user_id,
      name,
      phone,
      email,
      appointment_date,
      appointment_time,
      service_id,
      message,
    } = data;

    const query = `
      INSERT INTO appointments 
      (user_id, name, phone, email, appointment_date, appointment_time, service_id, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      user_id || null,
      name,
      phone,
      email,
      appointment_date,
      appointment_time || null,
      service_id,
      message || null,
    ]);

    return result.insertId;
  },

  /**
   * Update an appointment by ID.
   * @param {number} id - The appointment ID.
   * @param {object} data - Updated appointment details.
   */
  updateAppointment: async (id, data) => {
    const {
      name,
      phone,
      email,
      appointment_date,
      appointment_time,
      service_id,
      message,
      status,
    } = data;

    const query = `
      UPDATE appointments 
      SET name = ?, phone = ?, email = ?, appointment_date = ?, 
          appointment_time = ?, service_id = ?, message = ?, status = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
      name,
      phone,
      email,
      appointment_date,
      appointment_time || null,
      service_id,
      message || null,
      status || 'pending',
      id,
    ]);

    return result.affectedRows > 0;
  },

  /**
   * Delete an appointment by ID.
   * @param {number} id - The appointment ID.
   */
  deleteAppointment: async (id) => {
    const query = `DELETE FROM appointments WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = appointmentModel;