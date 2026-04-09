const db = require('../config/db');

// ➕ Add to cart
const addToCart = (data, callback) => {
  const sql = `
    INSERT INTO cart (user_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [data.user_id, data.product_id, data.quantity, data.price], callback);
};

// 📥 Get user cart
const getCartByUser = (userId, callback) => {
  const sql = `
    SELECT c.*, p.name, p.image 
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// ✏️ Update quantity
const updateCartItem = (id, quantity, callback) => {
  db.query("UPDATE cart SET quantity=? WHERE id=?", [quantity, id], callback);
};

// ❌ Remove item
const removeFromCart = (id, callback) => {
  db.query("DELETE FROM cart WHERE id=?", [id], callback);
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeFromCart
};