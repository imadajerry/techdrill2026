const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Public routes
productRoutes.get('/products', productController.getProducts);
productRoutes.get('/products/:id', productController.getProduct);

// Admin-only routes
productRoutes.post('/products', verifyToken, requireRole('admin', 'superadmin'), productController.createProduct);
productRoutes.put('/products/:id', verifyToken, requireRole('admin', 'superadmin'), productController.updateProduct);
productRoutes.delete('/products/:id', verifyToken, requireRole('admin', 'superadmin'), productController.deleteProduct);

module.exports = productRoutes;