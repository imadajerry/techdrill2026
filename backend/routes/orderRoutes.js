const express = require('express');
const orderRoutes = express.Router();
const orderController = require('../controllers/orderController');

// ➕ Place order
orderRoutes.post('/orders', orderController.placeOrder);

// 📥 Get user orders
orderRoutes.get('/orders/user/:userId', orderController.getUserOrders);

// 📥 Admin: all orders
orderRoutes.get('/orders', orderController.getAllOrders);

// ✏️ Update status
orderRoutes.put('/orders/:id/status', orderController.updateStatus);

module.exports = orderRoutes;
