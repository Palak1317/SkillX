// SkillXApp.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { motion } from "framer-motion";
import API from "./api"; // backend axios



/* ---------------------------------------------------------
   THEME CONTEXT
--------------------------------------------------------- */
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme === "dark" ? "app-root dark-theme" : "app-root light-theme"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}



/* ---------------------------------------------------------
   MAIN APP WRAPPER
--------------------------------------------------------- */
export default function SkillXApp() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}



/* ---------------------------------------------------------
   NAVBAR
--------------------------------------------------------- */
function Navbar() {
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <header className="app-header">
      <Link to="/" className="logo">
        <span className="logo-icon">✨</span>
        <span className="logo-text">SkillX</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/market">Marketplace</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/booking">Bookings</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/achievements">Achievements</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <div className="nav-right">
        <button className="btn-secondary small" onClick={toggle}>
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {/* 👉 New Register button */}
  <Link to="/register">
    <button className="btn-secondary small">Register</button>
  </Link>

        <Link to="/login">
          <button className="btn-primary small">Login</button>
        </Link>
      </div>
    </header>
  );
}



/* ---------------------------------------------------------
   HOME PAGE
--------------------------------------------------------- */
function Home() {
  const skills = ["Python", "Guitar", "Cooking", "UI/UX Design", "Yoga", "Photography"];

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Exchange skills. <br />
            Grow together with <span className="highlight">SkillX</span>.
          </motion.h1>

          <p className="hero-subtitle">
            Learn and teach skills worldwide with smart matching,
            tokens, and 1-to-1 sessions.
          </p>

          <div className="hero-buttons">
            <Link to="/onboarding"><button className="btn-primary">Get Started</button></Link>
            <Link to="/market"><button className="btn-outline">Explore Skills</button></Link>
          </div>
        </div>

        <div className="hero-card card">
          <p className="card-title">Today on SkillX</p>

          <div className="stats-row">
            <div className="stat"><p className="stat-number">128</p><p className="stat-label">Mentors</p></div>
            <div className="stat"><p className="stat-number">312</p><p className="stat-label">Sessions</p></div>
            <div className="stat"><p className="stat-number">4.8★</p><p className="stat-label">Rating</p></div>
          </div>
        </div>
      </section>

      <section className="grid">
        {skills.map((skill) => (
          <div key={skill} className="card">
            <h2 className="card-title">{skill}</h2>
            <p className="card-text">Learn or teach {skill} in 1-to-1 sessions.</p>
            <button className="btn-secondary small">Find a match</button>
          </div>
        ))}
      </section>
    </div>
  );
}



/* ---------------------------------------------------------
   LOGIN (WORKING BACKEND)
--------------------------------------------------------- */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/api/auth/login", { email, password });

      localStorage.setItem("skillx_token", res.data.token);

      setMsg("Login successful!");
      window.location.href = "/";
    } catch (err) {
      setMsg("Invalid email or password");
    }
  };

  return (
    <div className="page center">
      <div className="card card-narrow">
        <h2 className="section-title">Login</h2>

        <div className="form-group">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {msg && <p className="muted small">{msg}</p>}

        <button className="btn-primary full" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   REGISTER PAGE
--------------------------------------------------------- */
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/api/auth/register", { name, email, password });
      setMsg("Registered successfully! You can now login.");
    } catch (err) {
      setMsg("Email already exists.");
    }
  };

  return (
    <div className="page center">
      <div className="card card-narrow">
        <h2 className="section-title">Create Account</h2>

        <input className="input" placeholder="Name" value={name}
               onChange={(e) => setName(e.target.value)} />

        <input className="input" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} />

        <input className="input" placeholder="Password" type="password"
               value={password} onChange={(e) => setPassword(e.target.value)} />

        {msg && <p className="muted small">{msg}</p>}

        <button className="btn-primary full" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------
   MARKET (REAL BACKEND DATA)
--------------------------------------------------------- */
function Market() {
  const [market, setMarket] = useState([]);

  useEffect(() => {
    API.get("/api/market")
      .then((res) => setMarket(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="page">
      <h2 className="section-title">Skill Marketplace</h2>

      <div className="grid">
        {market.map((u) => (
          <div key={u.id} className="card">
            <h3 className="card-title">{u.name}</h3>
            <p>Teaches: <strong>{u.teaches || "None"}</strong></p>
            <p>Wants: <strong>{u.wants || "None"}</strong></p>
            <p className="muted small">{u.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



/* ---------------------------------------------------------
   EMPTY PAGES (READY FOR BACKEND INTEGRATION)
--------------------------------------------------------- */
/* ---------------------------------------------------------
   WALLET PAGE (TOKEN BALANCE + HISTORY)
--------------------------------------------------------- */
function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/api/wallet")
      .then((res) => setWallet(res.data))
      .catch(() => setMsg("Please login to view your wallet."));
  }, []);

  if (!wallet) {
    return (
      <div className="page">
        <h2 className="section-title">Wallet</h2>
        {msg && <p className="muted small">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="page wallet-layout">
      <div className="card">
        <h2 className="section-title">Skill Tokens</h2>
        <p className="muted small">
          Earn tokens by teaching. Spend them to book sessions.
        </p>

        <div className="stats-row">
          <div className="stat">
            <p className="stat-number">{wallet.balance}</p>
            <p className="stat-label">Available</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-subtitle">Recent activity</h3>
        {wallet.history.length === 0 && (
          <p className="muted small">No transactions yet.</p>
        )}
        <ul className="muted small">
          {wallet.history.map((t, idx) => (
            <li key={idx}>
              {t.amount > 0 ? "+" : ""}
              {t.amount} • {t.description} •{" "}
              {new Date(t.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------
   CHAT PAGE (SIMPLE DEMO)
--------------------------------------------------------- */
function Chat() {
  const [otherId, setOtherId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const loadChat = () => {
    if (!otherId) return;
    API.get(`/api/messages/${otherId}`)
      .then((res) => setMessages(res.data))
      .catch(() => setMsg("Please login to use chat."));
  };

  const sendMessage = async () => {
    if (!otherId || !text) return;
    try {
      await API.post("/api/messages", {
        receiver_id: otherId,
        content: text,
      });
      setText("");
      loadChat(); // reload after sending
    } catch {
      setMsg("Error sending message.");
    }
  };

  return (
    <div className="page chat-layout">
      <div className="card chat-sidebar">
        <h3 className="section-subtitle">Chat</h3>
        <p className="muted tiny">
          Enter another user ID to chat with (for demo).
        </p>
        <input
          className="input"
          placeholder="Other user ID"
          value={otherId}
          onChange={(e) => setOtherId(e.target.value)}
        />
        <button className="btn-secondary small" onClick={loadChat}>
          Load Conversation
        </button>
        {msg && <p className="muted small">{msg}</p>}
      </div>

      <div className="card chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <p className="muted small">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <p key={m.id} className="muted small">
                <strong>{m.sender_id}:</strong> {m.content}
              </p>
            ))
          )}
        </div>

        <div className="chat-input-row">
          <input
            className="input flex-1"
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn-primary small" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------
   BOOKINGS PAGE
--------------------------------------------------------- */
function Booking() {
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/api/sessions")
      .then((res) => setSessions(res.data))
      .catch(() => setMsg("Please login to view your bookings."));
  }, []);

  return (
    <div className="page">
      <h2 className="section-title">Your Sessions</h2>
      {msg && <p className="muted small">{msg}</p>}

      <div className="column-narrow">
        {sessions.length === 0 ? (
          <p className="muted small">No sessions booked yet.</p>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="card session-card">
              <p className="card-title">Session #{s.id}</p>
              <p className="muted small">
                Teacher ID: {s.teacher_id} • Learner ID: {s.learner_id}
              </p>
              <p className="muted small">
                Time: {new Date(s.scheduled_at).toLocaleString()}
              </p>
              <p className="muted small">Status: {s.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


/* ---------------------------------------------------------
   PROFILE PAGE (CONNECTED TO BACKEND)
--------------------------------------------------------- */
function Profile() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/api/me")
      .then((res) => setUser(res.data))
      .catch(() => setMsg("Please login to view your profile."));
  }, []);

  if (!user) {
    return (
      <div className="page">
        <h2 className="section-title">Profile</h2>
        {msg && <p className="muted small">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="section-title">Profile</h2>

      <div className="card">
        <h3 className="card-title">{user.name}</h3>
        <p className="muted small">{user.email}</p>
        <p className="muted small">City: {user.city || "Not set"}</p>
        <p className="muted small">Role: {user.role}</p>
      </div>
    </div>
  );
}


function Achievements() {
  return (
    <div className="page">
      <h2 className="section-title">Achievements</h2>
      <div className="card">Badges & rewards coming soon.</div>
    </div>
  );
}

/* ---------------------------------------------------------
   ADMIN DASHBOARD
--------------------------------------------------------- */
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/api/admin/overview")
      .then((res) => setStats(res.data))
      .catch(() =>
        setMsg("You must be logged in as admin to view this page.")
      );
  }, []);

  return (
    <div className="page">
      <h2 className="section-title">Admin Dashboard</h2>
      {msg && <p className="muted small">{msg}</p>}

      {stats && (
        <div className="grid three">
          <div className="card">
            <p className="muted small">Total users</p>
            <p className="stat-number">{stats.users}</p>
          </div>
          <div className="card">
            <p className="muted small">Total sessions</p>
            <p className="stat-number">{stats.sessions}</p>
          </div>
          <div className="card">
            <p className="muted small">Total messages</p>
            <p className="stat-number">{stats.messages}</p>
          </div>
        </div>
      )}
    </div>
  );
}


function Onboarding() {
  return (
    <div className="page">
      <h2 className="section-title">Onboarding</h2>
      <div className="card">Skill preferences & setup.</div>
    </div>
  );
}
