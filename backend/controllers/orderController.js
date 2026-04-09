const Order = require('../models/orderModel');
const db = require('../config/db');

// ➕ Place Order (from cart)
const placeOrder = (req, res) => {
  const { user_id, items, total_amount } = req.body;

  // Step 1: Create order
  Order.createOrder(user_id, total_amount, (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    const orderId = result.insertId;

    // Step 2: Add items
    Order.addOrderItems(orderId, items, (err) => {
      if (err) return res.status(500).json({ message: "Items Error" });

      res.status(201).json({
        message: "Order placed successfully",
        orderId
      });
    });
  });
};

// 📥 Get user orders
const getUserOrders = (req, res) => {
  const { userId } = req.params;

  Order.getOrdersByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(results);
  });
};

// 📥 Get all orders (Admin)
const getAllOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json(results);
  });
};

// ✏️ Update status (Admin)
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = [
    'placed','accepted','rejected','processed','dispatched','delivered'
  ];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  Order.updateOrderStatus(id, status, (err) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    res.json({ message: "Order status updated" });
  });
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateStatus
};