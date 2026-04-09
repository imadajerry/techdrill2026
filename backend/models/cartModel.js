const db = require('../config/db');

// ➕ Add to cart
const addToCart = (data, callback) => {
  // Check if same product+size already in cart
  const checkSql = `SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND (size = ? OR (size IS NULL AND ? IS NULL))`;
  db.query(checkSql, [data.user_id, data.product_id, data.size, data.size], (err, existing) => {
    if (err) return callback(err);

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + (data.quantity || 1);
      db.query("UPDATE cart SET quantity = ? WHERE id = ?", [newQty, existing[0].id], callback);
    } else {
      const sql = `INSERT INTO cart (user_id, product_id, quantity, size, price) VALUES (?, ?, ?, ?, ?)`;
      db.query(sql, [data.user_id, data.product_id, data.quantity || 1, data.size || null, data.price], callback);
    }
  });
};

// 📥 Get user cart with full product details
const getCartByUser = (userId, callback) => {
  const sql = `
    SELECT
      c.id,
      c.quantity,
      c.size,
      p.id AS product_id,
      p.name,
      p.category,
      p.price,
      p.originalPrice,
      p.image,
      p.description,
      p.stock,
      p.badge,
      p.targetGroup
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

// ✏️ Update quantity
const updateCartItem = (id, quantity, callback) => {
  db.query("UPDATE cart SET quantity = ? WHERE id = ?", [quantity, id], callback);
};

// ❌ Remove item
const removeFromCart = (id, callback) => {
  db.query("DELETE FROM cart WHERE id = ?", [id], callback);
};

// 🗑️ Clear entire cart for user (after checkout)
const clearCartByUser = (userId, callback) => {
  db.query("DELETE FROM cart WHERE user_id = ?", [userId], callback);
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeFromCart,
  clearCartByUser,
};