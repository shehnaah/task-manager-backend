const express = require('express');
const bodyparser = require('body-parser');
const { createPool } = require('mysql');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// MySQL Connection Pool
const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "Task-manager",
    connectionLimit: 10,
});

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
