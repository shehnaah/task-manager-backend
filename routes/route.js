const express = require('express');
const { register, login } = require('../controllers/usercontroller');
const taskController = require('../controllers/taskcontroller');
const authenticate = require('../middleware/jwtmiddleware'); // Middleware for protecting routes

const router = express.Router();

// Public Routes
router.post('/register', register); // Register Route
router.post('/login', login);       // Login Route

// Protected Routes (Require Authentication)
router.post('/tasks', authenticate, taskController.addTask);             // Add Task
router.get('/tasks/:userId', authenticate, taskController.getUserTasks); // Fetch Tasks for a User

module.exports = router;
