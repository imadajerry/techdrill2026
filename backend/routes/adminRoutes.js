const express = require('express');
const adminRoutes = express.Router();
const adminController = require('../controllers/adminController');
const reportController = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// All admin routes require auth + admin/superadmin role
adminRoutes.use(verifyToken, requireRole('admin', 'superadmin'));

// Dashboard
adminRoutes.get('/admin/dashboard', adminController.getDashboard);

// User management
adminRoutes.get('/admin/users', adminController.getUsers);
adminRoutes.put('/admin/users/:id', adminController.updateUserStatus);

// Inventory
adminRoutes.get('/admin/inventory', adminController.getInventory);
adminRoutes.put('/admin/inventory/:id', adminController.updateInventory);

// Reports
adminRoutes.get('/admin/reports/orders', reportController.getOrderSummary);
adminRoutes.get('/admin/reports/payments', reportController.getPaymentSummary);

module.exports = adminRoutes;
