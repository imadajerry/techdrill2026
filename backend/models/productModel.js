const db = require('../config/db');

// ➕ Create Product
const createProduct = (product, callback) => {
  const sql = `
    INSERT INTO products 
    (name, category, price, originalPrice, image, description, stock, badge, targetGroup)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    product.targetGroup || null
  ], callback);
};

// 📥 Get All Products
const getAllProducts = (callback) => {
  db.query("SELECT * FROM products", callback);
};

// 🔍 Get Product by ID
const getProductById = (id, callback) => {
  db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};

// ✏️ Update Product
const updateProduct = (id, product, callback) => {
  const sql = `
    UPDATE products SET
    name=?, category=?, price=?, originalPrice=?, image=?, description=?, stock=?, badge=?, targetGroup=?
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
    id
  ], callback);
};

// ❌ Delete Product
const deleteProduct = (id, callback) => {
  db.query("DELETE FROM products WHERE id = ?", [id], callback);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};