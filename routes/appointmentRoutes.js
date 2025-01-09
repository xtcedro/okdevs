const appointmentModel = require('./models/appointmentModel');

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await appointmentModel.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error.', error });
  }
});