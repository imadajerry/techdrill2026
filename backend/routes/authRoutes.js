const express = require('express');
const authRoutes = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyOtp,
} = require('../controllers/authController');

authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/verify-otp', verifyOtp);
authRoutes.post('/logout', logoutUser);

module.exports = authRoutes;
