const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ====== AUTH ======
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, city) VALUES (?,?,?,?)",
      [name, email, hash, city]
    );

    await pool.query("INSERT INTO wallets (user_id, balance) VALUES (?, 50)", [
      result.insertId,
    ]);

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering" });
  }
});

// Register user
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const password_hash = password; // (You can hash later)

  db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, password_hash],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Email already exists" });
      }
      return res.json({ message: "User registered successfully" });
    }
  );
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.get("/api/me", auth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, city, role FROM users WHERE id = ?",
    [req.user.id]
  );
  res.json(rows[0]);
});

// You can paste the rest of the APIs we wrote earlier here:
// /api/skills, /api/marketplace, /api/sessions, /api/wallet, /api/messages, /api/admin/summary etc.
app.get("/api/wallet", auth, async (req, res) => {
  const userId = req.user.id;

  const [[wallet]] = await pool.query(
    "SELECT balance FROM wallets WHERE user_id = ?",
    [userId]
  );

  const [history] = await pool.query(
    "SELECT amount, description, created_at FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  res.json({ balance: wallet.balance, history });
});

app.get("/api/messages/:otherId", auth, async (req, res) => {
  const user = req.user.id;
  const other = req.params.otherId;

  const [rows] = await pool.query(
    `SELECT * FROM messages
     WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY sent_at ASC`,
    [user, other, other, user]
  );

  res.json(rows);
});

app.post("/api/messages", auth, async (req, res) => {
  const sender = req.user.id;
  const { receiver_id, content } = req.body;

  await pool.query(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?,?,?)",
    [sender, receiver_id, content]
  );

  res.json({ message: "Message sent" });
});

// Create a session (booking)
app.post("/api/sessions", auth, async (req, res) => {
  const { teacher_id, learner_id, skill_id, scheduled_at } = req.body;
  await pool.query(
    "INSERT INTO sessions (teacher_id, learner_id, skill_id, scheduled_at, status) VALUES (?,?,?,?, 'pending')",
    [teacher_id, learner_id, skill_id, scheduled_at]
  );
  res.json({ message: "Session created" });
});

// List sessions for current user
app.get("/api/sessions", auth, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await pool.query(
    "SELECT * FROM sessions WHERE teacher_id = ? OR learner_id = ? ORDER BY scheduled_at DESC",
    [userId, userId]
  );
  res.json(rows);
});

// Simple admin stats
app.get("/api/admin/overview", auth, async (req, res) => {
  // only allow admin
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Not admin" });

  const [[users]] = await pool.query("SELECT COUNT(*) AS total FROM users");
  const [[sessions]] = await pool.query("SELECT COUNT(*) AS total FROM sessions");
  const [[messages]] = await pool.query("SELECT COUNT(*) AS total FROM messages");

  res.json({
    users: users.total,
    sessions: sessions.total,
    messages: messages.total,
  });
});


// Simple health check
app.get("/", (req, res) => {
  res.send("SkillX backend is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`SkillX backend running on http://localhost:${port}`);
});
