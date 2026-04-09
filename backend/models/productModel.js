const db = require('../config/db');

// ➕ Create Product
const createProduct = (product, callback) => {
  const sql = `
    INSERT INTO products
    (name, category, price, originalPrice, image, description, stock, badge, targetGroup, reorder_level, sku)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    product.name,
    product.category,
    product.price,
    product.originalPrice || null,
    product.image,
    product.description,
    product.stock,
    product.badge || null,
    product.targetGroup || null,
    product.reorder_level || 5,
    product.sku || null,
  ], callback);
};

// 📥 Get All Products
const getAllProducts = (callback) => {
  db.query("SELECT * FROM products ORDER BY created_at DESC", callback);
};

// 🔍 Get Product by ID
const getProductById = (id, callback) => {
  db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};

// 🔍 Get Products by category
const getProductsByCategory = (category, callback) => {
  db.query("SELECT * FROM products WHERE category = ?", [category], callback);
};

// 🔍 Search products by name
const searchProducts = (query, callback) => {
  db.query("SELECT * FROM products WHERE name LIKE ?", [`%${query}%`], callback);
};

// ✏️ Update Product
const updateProduct = (id, product, callback) => {
  const sql = `
    UPDATE products SET
    name=?, category=?, price=?, originalPrice=?, image=?, description=?, stock=?, badge=?, targetGroup=?, reorder_level=?, sku=?
    WHERE id=?
  `;

  db.query(sql, [
    product.name,
    product.category,
    product.price,
    product.originalPrice || null,
    product.image,
    product.description,
    product.stock,
    product.badge || null,
    product.targetGroup || null,
    product.reorder_level || 5,
    product.sku || null,
    id,
  ], callback);
};

// Update stock only
const updateStock = (id, stock, callback) => {
  db.query("UPDATE products SET stock = ? WHERE id = ?", [stock, id], callback);
};

// Update price only
const updatePrice = (id, price, callback) => {
  db.query("UPDATE products SET price = ? WHERE id = ?", [price, id], callback);
};

// ❌ Delete Product
const deleteProduct = (id, callback) => {
  db.query("DELETE FROM products WHERE id = ?", [id], callback);
};

// Get low stock products
const getLowStockProducts = (callback) => {
  db.query("SELECT * FROM products WHERE stock <= reorder_level", callback);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  updateProduct,
  updateStock,
  updatePrice,
  deleteProduct,
  getLowStockProducts,
};