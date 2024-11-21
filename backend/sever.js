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

// Route: Home
app.get('/home', (req, res) => {
    if (req.session.Username) {
        return res.json({ valid: true, Username: req.session.Username });
    } else {
        return res.json({ valid: false });
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
