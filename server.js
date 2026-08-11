const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// ===============================
// DATABASE
// ===============================

const db = new sqlite3.Database("./users.db");

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Serve your website files
app.use(express.static(__dirname));

// ===============================
// SIGN UP
// ===============================

app.post("/api/signup", async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
        success: false,
        message: "Please complete all fields."
    });
}

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        db.get(
            "SELECT id FROM users WHERE email = ?",
            [cleanEmail],
            async (err, existingUser) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                if (existingUser) {
                    return res.status(409).json({
                        success: false,
                        message: "An account with this email already exists."
                    });
                }

                const passwordHash = await bcrypt.hash(password, 12);

 db.run(
  `INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
  [fullName.trim(), cleanEmail, phone.trim(), passwordHash],
  function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Unable to create account."
      });
    }

    req.session.userId = this.lastID;

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      userId: this.lastID
    });
  }
);
   
            }
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Enter your email and password."
        });
    }

  const cleanEmail = email.trim().toLowerCase();

db.get(
  "SELECT id, full_name, email, phone, password_hash FROM users WHERE email = ?",
  [cleanEmail],
  async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server error."
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    req.session.userId = user.id;

    return res.json({
      success: true,
      message: "Login successful.",
      userId: user.id,
      redirect: "/dashboard.html"
    });
  }
);
});
 const port = process.env.port || 3000;
 app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});
 app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Tesla X.html"));
});

