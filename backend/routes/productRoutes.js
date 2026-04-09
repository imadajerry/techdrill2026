const express = require('express');
const productRoutes = express.Router();
const productController = require('../controllers/productController');

productRoutes.post('/products', productController.createProduct);
productRoutes.get('/products', productController.getProducts);
productRoutes.get('/products/:id', productController.getProduct);
productRoutes.put('/products/:id', productController.updateProduct);
productRoutes.delete('/products/:id', productController.deleteProduct);

module.exports = productRoutes;