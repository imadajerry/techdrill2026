const Cart = require('../models/cartModel');
const { ok, fail } = require('../utils/responseHelper');

// Transform cart rows from DB to frontend CartItem shape
function normalizeCartItem(row) {
  return {
    id: String(row.id),
    quantity: row.quantity,
    size: row.size || '',
    product: {
      id: String(row.product_id),
      name: row.name,
      category: row.category,
      price: Number(row.price),
      originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
      image: row.image,
      description: row.description,
      stock: row.stock,
      badge: row.badge || undefined,
      targetGroup: row.targetGroup || undefined,
    },
  };
}

// ➕ Add to cart
const addItem = (req, res) => {
  const userId = req.user.sub;
  const { product_id, quantity, price, size } = req.body;

  if (!product_id || !price) {
    return fail(res, 'product_id and price are required.');
  }

  Cart.addToCart({ user_id: userId, product_id, quantity: quantity || 1, price, size: size || null }, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, null, 'Item added to cart.', 201);
  });
};

// 📥 Get cart (uses auth token, no URL param needed)
const getCart = (req, res) => {
  const userId = req.user.sub;

  Cart.getCartByUser(userId, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, results.map(normalizeCartItem));
  });
};

// ✏️ Update quantity
const updateItem = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return fail(res, 'Quantity must be at least 1.');
  }

  Cart.updateCartItem(id, quantity, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { id: String(id) }, 'Cart updated.');
  });
};

// ❌ Remove item
const removeItem = (req, res) => {
  const { id } = req.params;

  Cart.removeFromCart(id, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { id: String(id) }, 'Item removed.');
  });
};

// 🗑️ Clear cart
const clearCart = (req, res) => {
  const userId = req.user.sub;

  Cart.clearCartByUser(userId, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, null, 'Cart cleared.');
  });
};

module.exports = {
  addItem,
  getCart,
  updateItem,
  removeItem,
  clearCart,
};