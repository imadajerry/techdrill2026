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

app.use(bodyParser.json());
module.exports = app;