const express = require('express');
const favouriteRoutes = express.Router();
const favouriteController = require('../controllers/favouriteController');
const verifyToken = require('../middleware/authMiddleware');

// All favourite routes require authentication
favouriteRoutes.get('/favourites', verifyToken, favouriteController.getFavourites);
favouriteRoutes.get('/favourites/ids', verifyToken, favouriteController.getFavouriteIds);
favouriteRoutes.post('/favourites/:productId', verifyToken, favouriteController.addFavourite);
favouriteRoutes.delete('/favourites/:productId', verifyToken, favouriteController.removeFavourite);

module.exports = favouriteRoutes;
