const express = require('express'); 
const app = express();
require('dotenv').config();

const cors = require("cors");

// ---- CORS FIX ----
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://2hzp70k6-5173.euw.devtunnels.ms"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
// ------------------

const testRoute = require('./routes/test');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const eventRoutes = require('./routes/events');

// Parse JSON
app.use(express.json());

// Routes
app.use('/api/test', testRoute);
app.use('/auth', authRoutes);
console.log('Auth routes mounted');
app.use('/profile', profileRoutes);
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
