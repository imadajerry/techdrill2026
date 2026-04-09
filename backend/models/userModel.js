const db = require('../config/db');

// Create user
const createUser = (user, callback) => {
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [user.username, user.email, user.password], callback);
};

// Get all users
const getUsers = (callback) => {
  db.query("SELECT * FROM users", callback);
};

// Get user by email
const getUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail
};