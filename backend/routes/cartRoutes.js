const express = require('express');
const cartRoutes = express.cartRoutes();
const cartController = require('../controllers/cartController');

cartRoutes.post('/cart', cartController.addItem);
cartRoutes.get('/cart/:userId', cartController.getCart);
cartRoutes.put('/cart/:id', cartController.updateItem);
cartRoutes.delete('/cart/:id', cartController.removeItem);

module.exports = cartRoutes;