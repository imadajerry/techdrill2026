const db = require('../config/db');

const getFavourites = (userId, callback) => {
  const sql = `
    SELECT p.*
    FROM favourites f
    JOIN products p ON f.product_id = p.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;
  db.query(sql, [userId], callback);
};

const addFavourite = (userId, productId, callback) => {
  const sql = `INSERT IGNORE INTO favourites (user_id, product_id) VALUES (?, ?)`;
  db.query(sql, [userId, productId], callback);
};

const removeFavourite = (userId, productId, callback) => {
  db.query("DELETE FROM favourites WHERE user_id = ? AND product_id = ?", [userId, productId], callback);
};

const isFavourite = (userId, productId, callback) => {
  db.query("SELECT id FROM favourites WHERE user_id = ? AND product_id = ?", [userId, productId], callback);
};

const getFavouriteIds = (userId, callback) => {
  db.query("SELECT product_id FROM favourites WHERE user_id = ?", [userId], callback);
};

module.exports = {
  getFavourites,
  addFavourite,
  removeFavourite,
  isFavourite,
  getFavouriteIds,
};
