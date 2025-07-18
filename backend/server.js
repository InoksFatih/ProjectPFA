const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const clientRoutes = require('./routes/clientRoutes');


const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));



// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/artisan', artisanRoutes);
app.use('/api/clients', clientRoutes);

// Test route
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json({ message: 'API Running', serverTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'DB connection failed', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
