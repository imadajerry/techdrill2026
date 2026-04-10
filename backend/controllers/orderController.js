const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { ok, fail } = require('../utils/responseHelper');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Transform flat joined rows into nested CustomerOrder shape
function groupOrderRows(rows) {
  const ordersMap = new Map();

  for (const row of rows) {
    const orderId = String(row.id);

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        id: orderId,
        total: Number(row.total_amount),
        status: row.status,
        paymentMethod: row.payment_method,
        shippingAddress: row.shipping_address || '',
        eta: row.eta ? new Date(row.eta).toISOString() : '',
        trackingNote: row.tracking_note || '',
        placedAt: new Date(row.created_at).toISOString(),
        items: [],
      });
    }

    const order = ordersMap.get(orderId);
    order.items.push({
      id: String(row.item_id),
      quantity: row.item_quantity,
      size: row.item_size || '',
      product: {
        id: String(row.product_id),
        name: row.product_name,
        category: row.product_category,
        price: Number(row.product_price),
        originalPrice: row.product_originalPrice ? Number(row.product_originalPrice) : undefined,
        image: row.product_image,
        description: row.product_description,
        stock: row.product_stock,
        badge: row.product_badge || undefined,
        targetGroup: row.product_targetGroup || undefined,
      },
    });
  }

  return Array.from(ordersMap.values());
}

// Transform admin order rows
function normalizeAdminOrder(row) {
  return {
    id: String(row.id),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    itemCount: row.item_count,
    total: Number(row.total_amount),
    status: row.status,
    paymentStatus: row.payment_status,
    placedAt: new Date(row.created_at).toISOString(),
  };
}

function getTrackingNote(status) {
  const notes = {
    accepted: 'The operations team accepted the order and moved it into the live queue.',
    processed: 'Warehouse QC is complete and the shipment is moving toward dispatch.',
    dispatched: 'The parcel left the hub and is now in the courier network.',
    delivered: 'The order reached the customer and delivery has been confirmed.',
    rejected: 'The order was rejected by the operations team.',
  };
  return notes[status] || '';
}

function createEtaDate() {
  const eta = new Date();
  eta.setDate(eta.getDate() + 4);
  return eta;
}

// ➕ Place Order
const placeOrder = (req, res) => {
  const userId = req.user.sub;
  const { items, total_amount, payment_method, shipping_address, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!items || items.length === 0) {
    return fail(res, 'Order must contain at least one item.');
  }

  if (!shipping_address || !shipping_address.trim()) {
    return fail(res, 'Shipping address is required.');
  }

  if (payment_method === 'Razorpay') {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return fail(res, 'Missing Razorpay payment details.');
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return fail(res, 'Invalid payment signature.');
    }
  }

  const orderData = {
    user_id: userId,
    total_amount,
    payment_method: payment_method || 'COD',
    payment_status: payment_method === 'Razorpay' ? 'paid' : 'pending',
    shipping_address: shipping_address.trim(),
    eta: createEtaDate(),
    tracking_note: 'Order confirmed and waiting for ops acceptance. Tracking will update from the admin queue.',
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  };

  Order.createOrder(orderData, (err, result) => {
    if (err) return fail(res, 'Database error.', 500);

    const orderId = result.insertId;

    Order.addOrderItems(orderId, items, (err) => {
      if (err) return fail(res, 'Failed to add order items.', 500);

      // Clear cart after order placed
      Cart.clearCartByUser(userId, () => {
        // Fetch the just-created order to return it fully populated
        Order.getOrderById(orderId, (err, rows) => {
          if (err || rows.length === 0) {
            return ok(res, { id: String(orderId) }, 'Order placed successfully.', 201);
          }
          const orders = groupOrderRows(rows);
          return ok(res, orders[0], 'Order placed successfully.', 201);
        });
      });
    });
  });
};

// 📥 Get user orders
const getUserOrders = (req, res) => {
  const userId = req.user.sub;

  Order.getOrdersByUser(userId, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, groupOrderRows(results));
  });
};

// 📥 Get all orders (Admin)
const getAllOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, results.map(normalizeAdminOrder));
  });
};

// ✏️ Update status (Admin)
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ['placed', 'accepted', 'rejected', 'processed', 'dispatched', 'delivered'];

  if (!validStatus.includes(status)) {
    return fail(res, 'Invalid status.');
  }

  const trackingNote = getTrackingNote(status);

  Order.updateOrderStatus(id, status, trackingNote, (err) => {
    if (err) return fail(res, 'Database error.', 500);
    return ok(res, { id: String(id), status, trackingNote }, 'Order status updated.');
  });
};

// 🔧 Create Razorpay Order Context
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return fail(res, 'Amount is required.');
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };
    
    const order = await razorpay.orders.create(options);
    return ok(res, order, 'Razorpay order created successfully.');
  } catch (err) {
    console.error('Razorpay Error:', err);
    return fail(res, 'Order failed', 500);
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateStatus,
  createRazorpayOrder,
};