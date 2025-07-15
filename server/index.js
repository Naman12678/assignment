// index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Atlas connected");
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.listen(PORT, () =>
      console.log(`🚀 Server live at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
})();

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'player'], default: 'player' },
  totalPoints: { type: Number, default: 0 },
});

const historySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  points: Number,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const History = mongoose.model('History', historySchema);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

// Register (player only)
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.json({ message: 'Registered successfully' });
});

// Login (admin or player)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Wrong password' });

  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: user.role, name: user.name });
});

// Admin: Seed 10 default users
app.get('/api/seed', async (req, res) => {
  const count = await User.countDocuments();
  if (count < 10) {
    const names = ['Rahul', 'Kamal', 'Sanak', 'Priya', 'Ravi', 'Ankit', 'Nisha', 'Aman', 'Divya', 'Tarun'];
    for (const name of names) {
      const email = `${name.toLowerCase()}@test.com`;
      const password = await bcrypt.hash('123456', 10);
      await User.create({ name, email, password, role: 'player' });
    }
  }

  // Add one admin
  const adminExists = await User.findOne({ email: 'admin@leader.com' });
  if (!adminExists) {
    const password = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@leader.com', password, role: 'admin' });
  }

  res.send({ message: 'Seeded players and admin' });
});

// Get leaderboard (with rank)
app.get('/api/leaderboard', authMiddleware, async (req, res) => {
  const users = await User.find({ role: 'player' }).sort({ totalPoints: -1 });
  const ranked = users.map((user, index) => ({
    _id: user._id,
    name: user.name,
    totalPoints: user.totalPoints,
    rank: index + 1,
  }));
  res.json(ranked);
});

// Player: Claim points
app.post('/api/claim', authMiddleware, async (req, res) => {
  if (req.user.role !== 'player') return res.status(403).json({ error: 'Only players can claim' });

  const user = await User.findById(req.user.id);
  const points = Math.floor(Math.random() * 10) + 1;

  user.totalPoints += points;
  await user.save();
  await History.create({ userId: user._id, points });

  const updatedUsers = await User.find({ role: 'player' }).sort({ totalPoints: -1 });
  const leaderboard = updatedUsers.map((u, index) => ({
    _id: u._id,
    name: u.name,
    totalPoints: u.totalPoints,
    rank: index + 1,
  }));

  res.json({ message: 'Points claimed', points, updatedUser: user.name, leaderboard });
});

// Admin: Delete a player
app.delete('/api/player/:id', authMiddleware, adminOnly, async (req, res) => {
  const player = await User.findById(req.params.id);
  if (!player || player.role !== 'player') return res.status(404).json({ error: 'Player not found' });

  await History.deleteMany({ userId: player._id });
  await player.deleteOne();

  res.json({ message: 'Player deleted' });
});

// Admin: Get claim history
app.get('/api/history', authMiddleware, adminOnly, async (req, res) => {
  const history = await History.find().sort({ timestamp: -1 }).populate('userId', 'name');
  res.json(history.map(h => ({
    user: h.userId.name,
    points: h.points,
    timestamp: h.timestamp,
  })));
});

// Get current profile
app.get('/api/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

