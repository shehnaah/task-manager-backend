const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./prisma/prisma-client');  
const pool = require('./database/connection'); 
const authRoutes = require('./routes/route');
const taskRoutes = require('./routes/route');
const jwtAuthMiddleware = require('./middleware/jwtmiddleware');
dotenv.config(); // Load environment variables from .env file

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Routes
app.use('/auth', authRoutes);
app.use('/api', jwtAuthMiddleware, taskRoutes); 
// Route to Get All Users
app.get('/users', (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error("Error connecting to database:", err);
            return res.status(500).send("Database connection error.");
        }

        console.log(`Connected as id ${conn.threadId}`);
        conn.query(`SELECT * FROM user`, (err, rows) => {
            conn.release();

            if (!err) {
                res.send(rows);
            } else {
                console.error("Error executing query:", err);
                res.status(500).send("Query execution error.");
            }
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
