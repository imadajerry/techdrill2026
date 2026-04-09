const db = require('../config/db');

// Dashboard: today's total collection
const getTodaysCollection = (callback) => {
  const sql = `
    SELECT COALESCE(SUM(total_amount), 0) AS total
    FROM orders
    WHERE payment_status = 'paid'
    AND DATE(created_at) = CURDATE()
  `;
  db.query(sql, callback);
};

// Dashboard: order counts by status
const getOrderCountsByStatus = (callback) => {
  const sql = `
    SELECT status, COUNT(*) AS count
    FROM orders
    GROUP BY status
  `;
  db.query(sql, callback);
};

// Dashboard: top customer today
const getTopCustomerToday = (callback) => {
  const sql = `
    SELECT u.username, SUM(o.total_amount) AS total_spent
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.payment_status = 'paid'
    AND DATE(o.created_at) = CURDATE()
    GROUP BY o.user_id
    ORDER BY total_spent DESC
    LIMIT 1
  `;
  db.query(sql, callback);
};

// Dashboard: trending products (most ordered)
const getTrendingProducts = (callback) => {
  const sql = `
    SELECT p.name, SUM(oi.quantity) AS total_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY oi.product_id
    ORDER BY total_sold DESC
    LIMIT 5
  `;
  db.query(sql, callback);
};

// Dashboard: low stock alerts
const getLowStockAlerts = (callback) => {
  db.query("SELECT name, stock FROM products WHERE stock <= reorder_level ORDER BY stock ASC", callback);
};

// All users with order counts
const getAllUsersWithCounts = (callback) => {
  const sql = `
    SELECT
      u.id, u.username AS name, u.email, u.role, u.status, u.created_at AS joinedAt,
      COUNT(o.id) AS ordersCount
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
  db.query(sql, callback);
};

// Inventory: products with stock details
const getInventory = (callback) => {
  const sql = `
    SELECT
      p.*,
      COALESCE(reserved.reserved_stock, 0) AS reservedStock
    FROM products p
    LEFT JOIN (
      SELECT oi.product_id, SUM(oi.quantity) AS reserved_stock
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('placed', 'accepted', 'processed')
      GROUP BY oi.product_id
    ) reserved ON p.id = reserved.product_id
    ORDER BY p.stock ASC
  `;
  db.query(sql, callback);
};

module.exports = {
  getTodaysCollection,
  getOrderCountsByStatus,
  getTopCustomerToday,
  getTrendingProducts,
  getLowStockAlerts,
  getAllUsersWithCounts,
  getInventory,
};
