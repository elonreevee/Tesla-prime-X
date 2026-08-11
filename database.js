const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "users.db");

const db = new sqlite3.Database(dbPath, (error) => {
    if (error) {
        console.error("Database connection error:", error);
    } else {
        console.log("SQLite database connected.");
    }
});

db.serialize(() => {
    db.run(
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    );
});

module.exports = db;