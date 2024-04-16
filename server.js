const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://db:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define user schema
const userSchema = new mongoose.Schema({
  userId: String,
  email: String,
  password: String  // Storing passwords as plain text
});

const User = mongoose.model('User', userSchema);

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
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
}

// Handle POST requests to /register
app.post('/register', async (req, res) => {
  const { userId, email, password } = req.body;

  // Validate user input
  if (!userId || !email || !password) {
    return res.status(400).send('Missing required fields');
  }

  if (!validateEmail(email)) {
    return res.status(400).send('Invalid email address');
  }

  if (!validatePassword(password)) {
    return res.status(400).send('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit');
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
const PORT = 3302;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
