const appointmentModel = require('../models/appointmentModel');

exports.createAppointment = async (req, res) => {
  const { user_id, name, phone, email, appointment_date, service, message } = req.body;

  try {
    await appointmentModel.createAppointment(user_id, name, phone, email, appointment_date, service, message);
    res.status(201).json({ success: true, message: 'Appointment created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating appointment.' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching appointments.' });
  }
};