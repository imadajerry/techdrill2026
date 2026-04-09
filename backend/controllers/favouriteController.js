const Favourite = require('../models/favouriteModel');
const { ok, fail } = require('../utils/responseHelper');
const { normalizeProduct } = require('./productController');

// 📥 Get user's favourites
const getFavourites = (req, res) => {
  const userId = req.user.sub;

  Favourite.getFavourites(userId, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, results.map(normalizeProduct));
  });
};

// Get favourite IDs only
const getFavouriteIds = (req, res) => {
  const userId = req.user.sub;

  Favourite.getFavouriteIds(userId, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, results.map(r => String(r.product_id)));
  });
};

// ➕ Add favourite
const addFavourite = (req, res) => {
  const userId = req.user.sub;
  const { productId } = req.params;

  Favourite.addFavourite(userId, productId, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { productId: String(productId) }, 'Added to favourites.', 201);
  });
};

// ❌ Remove favourite
const removeFavourite = (req, res) => {
  const userId = req.user.sub;
  const { productId } = req.params;

  Favourite.removeFavourite(userId, productId, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { productId: String(productId) }, 'Removed from favourites.');
  });
};

module.exports = {
  getFavourites,
  getFavouriteIds,
  addFavourite,
  removeFavourite,
};
