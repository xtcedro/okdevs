const userModel = require('./models/userModel');

app.post('/api/users/register', async (req, res) => {
  try {
    const userId = await userModel.createUser(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully!', userId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'Email already registered.' });
    } else {
      res.status(500).json({ success: false, message: 'Database error.', error });
    }
  }
});