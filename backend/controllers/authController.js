const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔐 REGISTER
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  User.createUser({ username, email, password: hashedPassword }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB Error" });
    }

    res.status(201).json({
      message: "User registered",
      userId: result.insertId
    });
  });
};

// 🔐 LOGIN
const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.getUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  });
};

// 🚪 LOGOUT
const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logout successful (delete token on frontend)" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};