const Report = require('../models/reportModel');
const { ok, fail } = require('../utils/responseHelper');

// 📊 Order summary report
const getOrderSummary = (req, res) => {
  const { start, end } = req.query;
  const startDate = start || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
  const endDate = end || new Date().toISOString();

  Report.getOrderSummary(startDate, endDate, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);

    const summary = results.map(row => ({
      status: row.status,
      count: row.count,
      revenue: Number(row.revenue),
    }));

    return ok(res, {
      period: { start: startDate, end: endDate },
      summary,
      totalOrders: summary.reduce((sum, r) => sum + r.count, 0),
      totalRevenue: summary.reduce((sum, r) => sum + r.revenue, 0),
    });
  });
};

// 💳 Payment summary report
const getPaymentSummary = (req, res) => {
  const { start, end } = req.query;
  const startDate = start || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
  const endDate = end || new Date().toISOString();

  Report.getPaymentSummary(startDate, endDate, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);

    const summary = results.map(row => ({
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      count: row.count,
      total: Number(row.total),
    }));

    return ok(res, {
      period: { start: startDate, end: endDate },
      summary,
    });
  });
};

module.exports = {
  getOrderSummary,
  getPaymentSummary,
};
