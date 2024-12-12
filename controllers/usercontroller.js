const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
  
      if (existingUser) {
        // If user with the same email already exists, return a response with error
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the new user in the database
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });
  
      // Send success response
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      // Handle any other errors
      console.error('Error in registration:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
