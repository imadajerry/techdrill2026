const db = require('../config/db');

// ➕ Create Order
const createOrder = (userId, totalAmount, callback) => {
  const sql = "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)";
  db.query(sql, [userId, totalAmount], callback);
};

// ➕ Add Order Items
const addOrderItems = (orderId, items, callback) => {
  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES ?
  `;

  const values = items.map(item => [
    orderId,
    item.product_id,
    item.quantity,
    item.price
  ]);

  db.query(sql, [values], callback);
};

// 📥 Get Orders by User
const getOrdersByUser = (userId, callback) => {
  const sql = `
    SELECT o.*, oi.product_id, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

// 📥 Get All Orders (Admin)
const getAllOrders = (callback) => {
  db.query("SELECT * FROM orders", callback);
};

// ✏️ Update Order Status
const updateOrderStatus = (orderId, status, callback) => {
  db.query("UPDATE orders SET status=? WHERE id=?", [status, orderId], callback);
};

module.exports = {
  createOrder,
  addOrderItems,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus
};