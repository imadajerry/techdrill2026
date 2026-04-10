const AdminModel = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const { ok, fail } = require('../utils/responseHelper');
const { normalizeProduct } = require('./productController');

// 📊 Dashboard summary
const getDashboard = (req, res) => {
  const dashboard = {};

  AdminModel.getTodaysCollection((err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    dashboard.todaysCollection = Number(results[0]?.total || 0);

    AdminModel.getOrderCountsByStatus((err, results) => {
      if (err) return fail(res, 'Database error.', 500);

      const statusLabels = ['placed', 'accepted', 'rejected', 'processed', 'dispatched', 'delivered'];
      const countsMap = {};
      for (const row of results) {
        countsMap[row.status] = row.count;
      }
      dashboard.orderCounts = statusLabels.map(s => ({
        label: s[0].toUpperCase() + s.slice(1),
        value: countsMap[s] || 0,
      }));

      AdminModel.getTopCustomerToday((err, results) => {
        if (err) return fail(res, 'Database error.', 500);
        dashboard.topCustomer = results[0]?.username || 'N/A';

        AdminModel.getTrendingProducts((err, results) => {
          if (err) return fail(res, 'Database error.', 500);
          dashboard.trendingProducts = results.map(r => r.name);

          AdminModel.getLowStockAlerts((err, results) => {
            if (err) return fail(res, 'Database error.', 500);
            dashboard.lowStockAlerts = results.map(r => ({
              name: r.name,
              stock: r.stock,
            }));

            return ok(res, dashboard);
          });
        });
      });
    });
  });
};

// 👥 List all users with order counts
const getUsers = (req, res) => {
  AdminModel.getAllUsersWithCounts((err, results) => {
    if (err) return fail(res, 'Database error.', 500);

    const users = results.map(row => ({
      id: String(row.id),
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
      joinedAt: new Date(row.joinedAt).toISOString(),
      ordersCount: row.ordersCount || 0,
    }));

    return ok(res, users);
  });
};

// 👤 Toggle user status
const updateUserStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const requesterRole = req.user?.role;

  const validStatuses = ['active', 'blocked', 'pending'];
  if (!validStatuses.includes(status)) {
    return fail(res, 'Invalid status. Must be active, blocked, or pending.');
  }

  User.getUserById(id, (err, results) => {
    if (err) return fail(res, 'Database error.', 500);
    if (!results || results.length === 0) return fail(res, 'User not found.', 404);

    const targetRole = results[0].role;

    if (requesterRole === 'admin') {
      if (targetRole !== 'customer') {
        return fail(res, 'Permission denied. Admins can only manage customers.', 403);
      }
    }

    User.updateUserStatus(id, status, (updateErr) => {
      if (updateErr) return fail(res, 'Database error.', 500);
      return ok(res, { id: String(id), status }, 'User status updated.');
    });
  });
};

// 📦 Get inventory
const getInventory = (req, res) => {
  AdminModel.getInventory((err, results) => {
    if (err) return fail(res, 'Database error.', 500);

    const inventory = results.map(row => ({
      ...normalizeProduct(row),
      reorderLevel: row.reorder_level || 5,
      reservedStock: row.reservedStock || 0,
      sku: row.sku || '',
    }));

    return ok(res, inventory);
  });
};

// 📦 Update inventory item (stock and/or price)
const updateInventory = (req, res) => {
  const { id } = req.params;
  const { stock, price } = req.body;

  if (stock !== undefined) {
    Product.updateStock(id, stock, (err) => {
      if (err) return fail(res, 'Database error.', 500);

      if (price !== undefined) {
        Product.updatePrice(id, price, (err) => {
          if (err) return fail(res, 'Database error.', 500);
          return ok(res, { id: String(id) }, 'Inventory updated.');
        });
      } else {
        return ok(res, { id: String(id) }, 'Stock updated.');
      }
    });
  } else if (price !== undefined) {
    Product.updatePrice(id, price, (err) => {
      if (err) return fail(res, 'Database error.', 500);
      return ok(res, { id: String(id) }, 'Price updated.');
    });
  } else {
    return fail(res, 'No update fields provided.');
  }
};

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
  getInventory,
  updateInventory,
};
