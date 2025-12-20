const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const axios = require('axios');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://mo_masar:Mo201567@masar1.tcv6q8u.mongodb.net/masar';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

const JWT_SECRET = 'your_secret_key_change_in_production';
// Allow override from env
const JWT_SECRET_REAL = process.env.JWT_SECRET || JWT_SECRET;

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, error: 'Authorization header missing' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ success: false, error: 'Invalid authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET_REAL);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: String,
  to: String,
  date: Date,
  departureTime: String,
  arrivalTime: String,
  price: Number,
  duration: Number,
  route: String,
  type: { type: String, enum: ['train','scan'], default: 'train' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Health
app.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

// Create booking (protected) - deduct balance and store booking
app.post('/bookings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const { from, to, date, departureTime, arrivalTime, price, duration, route, type } = req.body;
    const cost = Number(price) || 0;

    if (user.balance < cost) {
      return res.status(400).json({ success: false, error: 'Insufficient funds' });
    }

    // Deduct balance
    user.balance = Math.max(0, user.balance - cost);
    await user.save();

    const booking = new Booking({ userId: user._id, from, to, date: date ? new Date(date) : null, departureTime, arrivalTime, price: cost, duration, route, type: type || 'train' });
    await booking.save();

    res.json({ success: true, booking, balance: user.balance });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// Get bookings for authenticated user
app.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// Scan payment endpoint (protected) - small fare deduction and store as scan history
app.post('/scan', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const { amount, station } = req.body;
    const cost = Number(amount) || 0;

    if (user.balance < cost) {
      return res.status(400).json({ success: false, error: 'Insufficient funds' });
    }

    user.balance = Math.max(0, user.balance - cost);
    await user.save();

    const booking = new Booking({ userId: user._id, from: station || 'Unknown', to: station || 'Unknown', date: new Date(), departureTime: null, arrivalTime: null, price: cost, duration: 0, route: 'scan', type: 'scan' });
    await booking.save();

    res.json({ success: true, booking, balance: user.balance });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ success: false, error: 'Scan payment failed' });
  }
});

// Sign Up Route
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user with balance 0
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      balance: 0
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET_REAL, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        balance: newUser.balance
      }
    });
  } catch (error) {
    console.error('Signup error:', error.message || error);
    res.status(500).json({ success: false, error: error.message || 'Signup failed' });
  }
});

// Login Route
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET_REAL, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Login error:', error.message || error);
    res.status(500).json({ success: false, error: error.message || 'Login failed' });
  }
});

// Get User Route (protected)
app.get('/auth/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Update Balance Route
app.put('/auth/user/:userId/balance', async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { balance }, { new: true });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({ success: false, error: 'Failed to update balance' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Simple Chatbot proxy endpoint (POST /api/chat)
// Body: { message: string, history?: [{ role: 'user'|'assistant', content: string }] }
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'OPENAI_API_KEY not configured on server' });
    }

    // Build messages array for Chat Completions
    const messages = [];
    // system prompt
    messages.push({ role: 'system', content: 'You are Masar Assistant — a friendly assistant that helps users with Egypt train schedules, routes, and travel tips. Answer concisely and helpfully.' });
    // include conversation history if provided
    if (Array.isArray(history)) {
      history.forEach(h => {
        if (h.role && h.content) messages.push({ role: h.role, content: h.content });
      });
    }
    // user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI Chat Completions API (gpt-3.5-turbo)
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: 512,
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const assistantText = response.data?.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    res.json({ success: true, response: assistantText });
  } catch (error) {
    console.error('Chat proxy error:', error.response?.data || error.message || error);
    res.status(500).json({ success: false, error: 'Chatbot request failed' });
  }
});
