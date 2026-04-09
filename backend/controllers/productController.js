const Product = require('../models/productModel');
const { ok, fail } = require('../utils/responseHelper');

// Helper: normalize product row from MySQL to match frontend Product type
function normalizeProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
    image: row.image,
    description: row.description,
    stock: row.stock,
    badge: row.badge || undefined,
    targetGroup: row.targetGroup || undefined,
  };
}

// ➕ Create
const createProduct = (req, res) => {
  const product = req.body;

  Product.createProduct(product, (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return fail(res, 'Failed to create product.', 500);
    }

    return ok(res, { id: String(result.insertId) }, 'Product created.', 201);
  });
};

// 📥 Get All
const getProducts = (req, res) => {
  const { category, search } = req.query;

  if (search) {
    return Product.searchProducts(search, (err, results) => {
      if (err) return fail(res, 'Database error.', 500);
      return ok(res, results.map(normalizeProduct));
    });
  }

  if (category) {
    return Product.getProductsByCategory(category, (err, results) => {
      if (err) return fail(res, 'Database error.', 500);
      return ok(res, results.map(normalizeProduct));
    });
  }

  Product.getAllProducts((err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, results.map(normalizeProduct));
  });
};

// 🔍 Get by ID
const getProduct = (req, res) => {
  const { id } = req.params;

  Product.getProductById(id, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    if (results.length === 0) return fail(res, 'Product not found.', 404);
    return ok(res, normalizeProduct(results[0]));
  });
};

// ✏️ Update
const updateProduct = (req, res) => {
  const { id } = req.params;

  Product.updateProduct(id, req.body, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { id: String(id) }, 'Product updated.');
  });
};

// ❌ Delete
const deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.deleteProduct(id, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { id: String(id) }, 'Product deleted.');
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  normalizeProduct,
};