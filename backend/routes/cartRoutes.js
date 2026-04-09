const express = require('express');
const cartRoutes = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');

// All cart routes require authentication
cartRoutes.get('/cart', verifyToken, cartController.getCart);
cartRoutes.post('/cart', verifyToken, cartController.addItem);
cartRoutes.put('/cart/:id', verifyToken, cartController.updateItem);
cartRoutes.delete('/cart/:id', verifyToken, cartController.removeItem);
cartRoutes.delete('/cart', verifyToken, cartController.clearCart);

module.exports = cartRoutes;
