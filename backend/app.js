const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
app.use('/api',authRoutes);
  
const productRoutes = require('./routes/productRoutes');
app.use('/api',productRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api',cartRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api',orderRoutes);

const recomRoutes = require('./routes/orderRoutes');
app.use('/api',recomRoutes);

app.use(bodyParser.json());
module.exports = app;