const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use express-session middleware for session management
app.use(session({
  secret: 'your-secret-key', // Change this to a strong and secure secret
  resave: false,
  saveUninitialized: true,
}));

// Dummy user data (replace with a database in a real-world scenario)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Signup API
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Dummy user creation (replace with database operations)
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  res.status(201).json({ message: 'User created successfully' });
});

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy user authentication (replace with database operations)
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Set session user
    req.session.user = user;
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected API route
app.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.session.user });
});

// Logout API
app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Error logging out' });
    } else {
      res.status(200).json({ message: 'Logout successful' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
