const Cart = require('../models/cartModel');

// ➕ Add to cart
const addItem = (req, res) => {
  const { user_id, product_id, quantity, price } = req.body;

  Cart.addToCart({ user_id, product_id, quantity, price }, (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ message: "Item added to cart" });
  });
};

// 📥 Get cart
const getCart = (req, res) => {
  const { userId } = req.params;

  Cart.getCartByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(results);
  });
};

// ✏️ Update quantity
const updateItem = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  Cart.updateCartItem(id, quantity, (err) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ message: "Cart updated" });
  });
};

// ❌ Remove item
const removeItem = (req, res) => {
  const { id } = req.params;

  Cart.removeFromCart(id, (err) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ message: "Item removed" });
  });
};

module.exports = {
  addItem,
  getCart,
  updateItem,
  removeItem
};