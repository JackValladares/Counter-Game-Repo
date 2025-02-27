const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// **GET: Fetch All Scores**
app.get("/scores", (req, res) => {
    db.query("SELECT * FROM game_scores ORDER BY user_score DESC", (err, results) => {
        if (err) res.status(500).json({ error: err });
        else res.json(results);
    });
});

// **POST: Update Score**
app.post("/update", (req, res) => {
    const { pkey, delta } = req.body;
    db.query("UPDATE game_scores SET user_score = user_score + ? WHERE pkey = ?", [delta, pkey], (err) => {
        if (err) res.status(500).json({ error: err });
        else res.sendStatus(200);
    });
});

// **Start the Server**
app.listen(4000, () => console.log("Server running on port 4000"));