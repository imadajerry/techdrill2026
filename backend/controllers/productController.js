const Product = require('../models/productModel');

// ➕ Create
const createProduct = (req, res) => {
  console.log("BODY DATA:", req.body);
  const product = req.body;

  Product.createProduct(product, (err, result) => {
  if (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: err.message });
  }

  res.status(201).json({
    message: "Product created",
    productId: result.insertId
  });
});
};

// 📥 Get All
const getProducts = (req, res) => {
  Product.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(results);
  });
};

// 🔍 Get by ID
const getProduct = (req, res) => {
  const { id } = req.params;

  Product.getProductById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(results[0]);
  });
};

// ✏️ Update
const updateProduct = (req, res) => {
  const { id } = req.params;

  Product.updateProduct(id, req.body, (err) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ message: "Product updated" });
  });
};

// ❌ Delete
const deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.deleteProduct(id, (err) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ message: "Product deleted" });
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};