const db = require('../config/db');

// ➕ Create Order
const createOrder = (orderData, callback) => {
  const sql = `
    INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, shipping_address, eta, tracking_note)
    VALUES (?, ?, 'placed', ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    orderData.user_id,
    orderData.total_amount,
    orderData.payment_method || 'COD',
    orderData.payment_status || 'paid',
    orderData.shipping_address || '',
    orderData.eta || null,
    orderData.tracking_note || 'Order confirmed and waiting for ops acceptance.',
  ], callback);
};

// ➕ Add Order Items
const addOrderItems = (orderId, items, callback) => {
  const sql = `INSERT INTO order_items (order_id, product_id, quantity, size, price) VALUES ?`;
  const values = items.map(item => [
    orderId,
    item.product_id,
    item.quantity,
    item.size || null,
    item.price,
  ]);
  db.query(sql, [values], callback);
};

// 📥 Get Orders by User (with items and product details)
const getOrdersByUser = (userId, callback) => {
  const sql = `
    SELECT
      o.id, o.total_amount, o.status, o.payment_method, o.payment_status,
      o.shipping_address, o.eta, o.tracking_note, o.created_at,
      oi.id AS item_id, oi.quantity AS item_quantity, oi.size AS item_size, oi.price AS item_price,
      p.id AS product_id, p.name AS product_name, p.category AS product_category,
      p.price AS product_price, p.originalPrice AS product_originalPrice,
      p.image AS product_image, p.description AS product_description,
      p.stock AS product_stock, p.badge AS product_badge, p.targetGroup AS product_targetGroup
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

// 📥 Get All Orders (Admin) with user details
const getAllOrders = (callback) => {
  const sql = `
    SELECT
      o.id, o.total_amount, o.status, o.payment_method, o.payment_status,
      o.shipping_address, o.created_at,
      u.username AS customer_name, u.email AS customer_email,
      (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, callback);
};

// ✏️ Update Order Status
const updateOrderStatus = (orderId, status, trackingNote, callback) => {
  const sql = "UPDATE orders SET status = ?, tracking_note = ? WHERE id = ?";
  db.query(sql, [status, trackingNote || null, orderId], callback);
};

// Get single order with items
const getOrderById = (orderId, callback) => {
  const sql = `
    SELECT
      o.id, o.user_id, o.total_amount, o.status, o.payment_method, o.payment_status,
      o.shipping_address, o.eta, o.tracking_note, o.created_at,
      oi.id AS item_id, oi.quantity AS item_quantity, oi.size AS item_size, oi.price AS item_price,
      p.id AS product_id, p.name AS product_name, p.category AS product_category,
      p.price AS product_price, p.originalPrice AS product_originalPrice,
      p.image AS product_image, p.description AS product_description,
      p.stock AS product_stock, p.badge AS product_badge, p.targetGroup AS product_targetGroup
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?
  `;
  db.query(sql, [orderId], callback);
};

module.exports = {
  createOrder,
  addOrderItems,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
};