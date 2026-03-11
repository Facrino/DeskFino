import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("finovex.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0,
    profit REAL DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plan_name TEXT,
    amount REAL,
    profit_rate REAL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT, -- 'deposit', 'withdraw', 'invest', 'profit'
    amount REAL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const result = db.prepare("INSERT INTO users (name, email, phone, password, referral_code) VALUES (?, ?, ?, ?, ?)").run(name, email, phone, password, referralCode);
      res.json({ id: result.lastInsertRowid, name, email });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/user/:id/dashboard", (req, res) => {
    const userId = req.params.id;
    const user = db.prepare("SELECT balance, profit FROM users WHERE id = ?").get(userId);
    const activeInvestments = db.prepare("SELECT SUM(amount) as total FROM investments WHERE user_id = ? AND status = 'active'").get(userId);
    const history = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10").all(userId);
    
    res.json({
      balance: user?.balance || 0,
      profit: user?.profit || 0,
      activeInvestment: activeInvestments?.total || 0,
      history
    });
  });

  app.post("/api/transactions/deposit", (req, res) => {
    const { userId, amount } = req.body;
    db.transaction(() => {
      db.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").run(amount, userId);
      db.prepare("INSERT INTO transactions (user_id, type, amount) VALUES (?, 'deposit', ?)").run(userId, amount);
    })();
    res.json({ success: true });
  });

  app.post("/api/invest", (req, res) => {
    const { userId, planName, amount, profitRate } = req.body;
    const user = db.prepare("SELECT balance FROM users WHERE id = ?").get(userId);
    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    
    db.transaction(() => {
      db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(amount, userId);
      db.prepare("INSERT INTO investments (user_id, plan_name, amount, profit_rate) VALUES (?, ?, ?, ?)").run(userId, planName, amount, profitRate);
      db.prepare("INSERT INTO transactions (user_id, type, amount) VALUES (?, 'invest', ?)").run(userId, amount);
    })();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
