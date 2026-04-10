const db = require('../config/db');
const { ok, fail } = require('../utils/responseHelper');
const { normalizeProduct } = require('./productController');

const getSmartRecommendations = (req, res) => {
  const userId = req.params.userId;

  const cartQuery = `
    SELECT DISTINCT p.*
    FROM products p
    WHERE p.category IN (
      SELECT DISTINCT pr.category
      FROM cart c
      JOIN products pr ON c.product_id = pr.id
      WHERE c.user_id = ?
    )
    AND p.id NOT IN (
      SELECT product_id FROM cart WHERE user_id = ?
    )
    LIMIT 10
  `;

  db.query(cartQuery, [userId, userId], (err, cartResults) => {
    if (err) {
      return fail(res, 'Database error.', 500);
    }

    if (cartResults.length > 0) {
      return ok(res, cartResults.map(normalizeProduct));
    }

    // fallback to activity
    const activityQuery = `
      SELECT p.category, COUNT(*) as total
      FROM user_activity ua
      JOIN products p ON ua.product_id = p.id
      WHERE ua.user_id = ?
      GROUP BY p.category
      ORDER BY total DESC
      LIMIT 1
    `;

    db.query(activityQuery, [userId], (err, result) => {
      if (err) {
        return fail(res, 'Database error.', 500);
      }

      if (result.length === 0) {
        // Ultimate fallback if no cart and no activity exist
        db.query(
          "SELECT * FROM products WHERE id NOT IN (SELECT product_id FROM cart WHERE user_id = ?) LIMIT 10",
          [userId],
          (err, products) => {
           if (err) return fail(res, 'Database error.', 500);
           return ok(res, products.map(normalizeProduct));
          }
        );
        return;
      }

      const category = result[0].category;

      db.query(
        "SELECT * FROM products WHERE category = ? AND id NOT IN (SELECT product_id FROM cart WHERE user_id = ?) LIMIT 10",
        [category, userId],
        (err, products) => {
          if (err) {
            return fail(res, 'Database error.', 500);
          }

          return ok(res, products.map(normalizeProduct));
        }
      );
    });
  });
};

module.exports = {
  getSmartRecommendations,
};
