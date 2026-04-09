const db = require('../config/db');

// Order summary by status for a date range
const getOrderSummary = (startDate, endDate, callback) => {
  const sql = `
    SELECT
      status,
      COUNT(*) AS count,
      COALESCE(SUM(total_amount), 0) AS revenue
    FROM orders
    WHERE created_at BETWEEN ? AND ?
    GROUP BY status
  `;
  db.query(sql, [startDate, endDate], callback);
};

// Payment summary grouped by method
const getPaymentSummary = (startDate, endDate, callback) => {
  const sql = `
    SELECT
      payment_method,
      payment_status,
      COUNT(*) AS count,
      COALESCE(SUM(total_amount), 0) AS total
    FROM orders
    WHERE created_at BETWEEN ? AND ?
    GROUP BY payment_method, payment_status
  `;
  db.query(sql, [startDate, endDate], callback);
};

module.exports = {
  getOrderSummary,
  getPaymentSummary,
};
