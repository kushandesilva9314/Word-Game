import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'; // For reading wordlist.json

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000'], // Allow requests from the React frontend
    methods: ["POST", "GET"],
    credentials: true // Allow credentials (session cookies)
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to `true` if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Variable to store the username globally for session-based use
let UN = ''; 

// Route: Home
app.get('/home', (req, res) => {
    if (req.session.Username) {
        UN = req.session.Username; // Save the username to the global variable
        return res.json({ valid: true, Username: req.session.Username });
    } else {
        return res.json({ valid: false });
    }
});

// Route: Get user's streak
app.get('/streak', (req, res) => {
    if (!UN) {
        return res.json({ success: false, message: "User not logged in" });
    }

    const sql = "SELECT Streak FROM gameusers WHERE Username = ?";
    db.query(sql, [UN], (err, result) => {
        if (err) {
            console.error("Error fetching streak:", err);
            return res.json({ success: false, message: "Database error", error: err });
        }

        if (result.length > 0) {
            return res.json({ success: true, streak: result[0].Streak });
        } else {
            return res.json({ success: false, message: "User not found" });
        }
    });
});


// Route: Increment streak
app.post('/increment-streak', (req, res) => {
    if (!UN) {
        return res.json({ success: false, message: "User not logged in" });
    }

    // Fetch the current streak for the user
    const fetchStreakSql = "SELECT Streak FROM gameusers WHERE Username = ?";
    db.query(fetchStreakSql, [UN], (err, result) => {
        if (err) {
            console.error("Error fetching streak:", err);
            return res.json({ success: false, message: "Database error", error: err });
        }

        if (result.length > 0) {
            const currentStreak = result[0].Streak;
            const newStreak = currentStreak + 1;

            // Update the streak in the database
            const updateStreakSql = "UPDATE gameusers SET Streak = ? WHERE Username = ?";
            db.query(updateStreakSql, [newStreak, UN], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating streak:", updateErr);
                    return res.json({ success: false, message: "Error updating streak", error: updateErr });
                }

                return res.json({ success: true, message: "Streak incremented successfully", newStreak });
            });
        } else {
            return res.json({ success: false, message: "User not found" });
        }
    });
});

// Route: Get and reset streak if lost
app.post('/reset-streak', (req, res) => {
    if (!UN) {
        return res.json({ success: false, message: "User not logged in" });
    }

    const { lost } = req.body; // Expecting `lost` to be passed as part of the request body

    if (!lost) {
        // If the game is not lost, just return the current streak
        const fetchStreakSql = "SELECT Streak FROM gameusers WHERE Username = ?";
        db.query(fetchStreakSql, [UN], (err, result) => {
            if (err) {
                console.error("Error fetching streak:", err);
                return res.json({ success: false, message: "Database error", error: err });
            }

            if (result.length > 0) {
                return res.json({ success: true, streak: result[0].Streak });
            } else {
                return res.json({ success: false, message: "User not found" });
            }
        });
    } else {
        // If the game is lost, reset the streak to 0
        const resetStreakSql = "UPDATE gameusers SET Streak = 0 WHERE Username = ?";
        db.query(resetStreakSql, [UN], (err, result) => {
            if (err) {
                console.error("Error resetting streak:", err);
                return res.json({ success: false, message: "Error resetting streak", error: err });
            }

            return res.json({ success: true, message: "Streak reset to 0" });
        });
    }
});



// Load wordlist data
const wordlistData = JSON.parse(fs.readFileSync(path.join(__dirname, 'wordlist.json'), 'utf8'));

// Route: Get wordlist data
app.get('/data', (req, res) => {
    res.json(wordlistData);
});

// Route: Register user
app.post('/register', (req, res) => {
    const sql = "INSERT INTO gameusers (`Email`, `Username`, `Password`) VALUES (?)";
    const values = [
        req.body.Email,
        req.body.Username,
        req.body.Password,
    ];
    db.query(sql, [values], (err, result) => {
        if (err) return res.json({ Message: "Error in Node", Error: err });
        return res.json(result);
    });
});

// Route: Login user
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM gameusers WHERE Username = ? AND Password = ?";
    db.query(sql, [req.body.Username, req.body.Password], (err, result) => {
        if (err) return res.json({ Message: "Error inside server", Error: err });
        if (result.length > 0) {
            req.session.Username = result[0].Username;
            return res.json({ Login: true });
        } else {
            return res.json({ Login: false });
        }
    });
});

// Route: Logout user
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ Message: "Logout failed", Success: false });
        } else {
            res.clearCookie('connect.sid'); // Clear the session cookie
            return res.json({ Message: "Logout successful", Success: true });
        }
    });
});

// Start server
app.listen(8081, () => {
    console.log("Connected to server on port 8081");
});
