const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));


// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api', cartRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);

const favouriteRoutes = require('./routes/favouriteRoutes');
app.use('/api', favouriteRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api', chatRoutes);

const recomRoutes = require('./routes/smartRecommendation');
app.use('/api', recomRoutes);

module.exports = app;
