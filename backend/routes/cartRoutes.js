const express = require('express');
const cartRoutes = express.Router();
const cartController = require('../controllers/cartController');

cartRoutes.post('/cart', cartController.addItem);
cartRoutes.get('/cart/:userId', cartController.getCart);
cartRoutes.put('/cart/:id', cartController.updateItem);
cartRoutes.delete('/cart/:id', cartController.removeItem);

module.exports = cartRoutes;
