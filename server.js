const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Use MONGO_URL environment variable for MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define user schema
const userSchema = new mongoose.Schema({
  userId: String,
  email: String,
  password: String  // Storing passwords as plain text
});

const User = mongoose.model('User', userSchema);

// Define contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  return re.test(password);
}

// Handle POST requests to /register
app.post('/register', async (req, res) => {
  const { userId, email, password } = req.body;
  const errors = [];

  // Validate user input
  if (!userId) {
    errors.push('Missing userId field');
  }

  if (!email) {
    errors.push('Missing email field');
  } else if (!validateEmail(email)) {
    errors.push('Invalid email address');
  }

  if (!password) {
    errors.push('Missing password field');
  } else if (!validatePassword(password)) {
    errors.push('Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter, and one digit');
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create a new user
    const newUser = new User({
      userId,
      email,
      password  // Storing password as plain text
    });

    // Save the user to the database
    await newUser.save();

    // Send registration successful message
    res.status(200).send('Registration Successful');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// Handle POST requests to /login
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  // Validate user input
  if (!userId || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Find the user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare passwords
    if (user.password !== password) {  // Compare plain text passwords
      return res.status(400).send('Invalid credentials');
    }

    // Successful login
    res.status(200).send('Login Successful');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

// Handle POST requests to /contact
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate user input
  if (!name || !email || !subject || !message) {
    return res.status(400).send('Missing required fields');
  }

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email address');
  }

  try {
    // Create a new contact message
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save the contact message to the database
    await newContact.save();

    // Send confirmation message
    res.redirect('/thankyou.html');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message');
  }
});

// Serve login.html for /login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve register.html for /register route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = 3308; // Ensure this port matches docker-compose.yml
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
