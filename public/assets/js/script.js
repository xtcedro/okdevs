const API_BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://www.okdevs.xyz'; // Updated to use www.okdevs.xyz for production

// Attach an event listener to the form submission
document.getElementById('appointmentForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from reloading the page

  // Collect form data
  const formData = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    appointment_date: document.getElementById('appointment_date').value.trim(),
    appointment_time: document.getElementById('appointment_time').value.trim(),
    service: document.getElementById('service').value.trim(),
    message: document.getElementById('message').value.trim(),
  };

  console.log('Collected Form Data:', formData); // Debugging log for form data

  // Validate form data
  if (!formData.name || !formData.phone || !formData.email || !formData.appointment_date || !formData.service) {
    const responseMessage = document.getElementById('responseMessage');
    responseMessage.textContent = 'All fields are required.';
    responseMessage.className = 'response-message error';
    responseMessage.style.display = 'block';
    return;
  }

  // Send data to the backend
  try {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Display success or error message
    const responseMessage = document.getElementById('responseMessage');
    const message = await response.text();

    if (response.ok) {
      responseMessage.textContent = message || 'Appointment booked successfully!';
      responseMessage.className = 'response-message success'; // Apply success style
      document.getElementById('appointmentForm').reset(); // Clear the form
    } else {
      responseMessage.textContent = `Error: ${message || 'Failed to book the appointment.'}`;
      responseMessage.className = 'response-message error'; // Apply error style
    }
    responseMessage.style.display = 'block'; // Make the message visible
  } catch (error) {
    console.error('Error:', error);
    const responseMessage = document.getElementById('responseMessage');
    responseMessage.textContent = 'Failed to connect to the server.';
    responseMessage.className = 'response-message error';
    responseMessage.style.display = 'block';
  }
});