const express = require('express');
const orderRoutes = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Customer routes
orderRoutes.post('/orders', verifyToken, orderController.placeOrder);
orderRoutes.post('/orders/razorpay-order', verifyToken, orderController.createRazorpayOrder);
orderRoutes.get('/orders/mine', verifyToken, orderController.getUserOrders);

// Admin routes
orderRoutes.get('/orders', verifyToken, requireRole('admin', 'superadmin'), orderController.getAllOrders);
orderRoutes.put('/orders/:id/status', verifyToken, requireRole('admin', 'superadmin'), orderController.updateStatus);

module.exports = orderRoutes;
