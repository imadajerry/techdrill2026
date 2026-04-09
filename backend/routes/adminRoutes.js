const express = require('express');
const adminRoutes = express.Router();
const adminController = require('../controllers/adminController');
const reportController = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const adminGuard = [verifyToken, requireRole('admin', 'superadmin')];

// Dashboard
adminRoutes.get('/admin/dashboard', ...adminGuard, adminController.getDashboard);

// User management
adminRoutes.get('/admin/users', ...adminGuard, adminController.getUsers);
adminRoutes.put('/admin/users/:id', ...adminGuard, adminController.updateUserStatus);

// Inventory
adminRoutes.get('/admin/inventory', ...adminGuard, adminController.getInventory);
adminRoutes.put('/admin/inventory/:id', ...adminGuard, adminController.updateInventory);

// Reports
adminRoutes.get('/admin/reports/orders', ...adminGuard, reportController.getOrderSummary);
adminRoutes.get('/admin/reports/payments', ...adminGuard, reportController.getPaymentSummary);

module.exports = adminRoutes;
