const db = require('../config/db');

// Create user
const createUser = (user, callback) => {
  const sql = "INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [user.username, user.email, user.password, user.role || 'customer', user.status || 'active'], callback);
};

// Get all users
const getUsers = (callback) => {
  db.query("SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC", callback);
};

// Get user by email
const getUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

// Get user by ID
const getUserById = (id, callback) => {
  db.query("SELECT id, username, email, role, status, created_at FROM users WHERE id = ?", [id], callback);
};

// Update user status (block/approve)
const updateUserStatus = (id, status, callback) => {
  db.query("UPDATE users SET status = ? WHERE id = ?", [status, id], callback);
};

// Count orders per user
const getUserOrderCounts = (callback) => {
  const sql = `
    SELECT u.id, COUNT(o.id) as ordersCount
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
  `;
  db.query(sql, callback);
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  updateUserStatus,
  getUserOrderCounts,
};