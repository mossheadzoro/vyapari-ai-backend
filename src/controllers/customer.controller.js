import Customer from "../models/Customer.js";
import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";


export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ created_at: -1 });

    const result = await Promise.all(
      customers.map(async (c) => {
        const invoices = await Invoice.find(
          { customerId: c._id },
          { totalAmount: 1, paidAmount: 1 }
        );

        const netDue = invoices.reduce(
          (sum, inv) => sum + (inv.totalAmount - inv.paidAmount),
          0
        );

        return {
          id: c._id,
          name: c.name,
          telegramId: c.telegram_id || null, // 🔥 MAP HERE
          createdAt: c.createdAt || null,
          netDue
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Fetch customers failed:", err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};


/**
 * GET /api/customers/:id/transactions
 */



import Order from "../models/Order.js";


/**
 * GET /api/customers/:id/transactions
 */
export const getCustomerTransactions = async (req, res) => {
  try {
    const customerId = new mongoose.Types.ObjectId(req.params.id);

    // 1️⃣ Find all orders of this customer
    const orders = await Order.find(
      { customer_id: customerId },
      { _id: 1, order_name: 1 }
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map(o => o._id.toString());

    // 2️⃣ Find invoices for those orders
    const invoices = await Invoice.find({
      order_id: { $in: orderIds }
    }).sort({ created_at: -1 });

    // 3️⃣ Map order_id → order_name
    const orderMap = {};
    orders.forEach(o => {
      orderMap[o._id.toString()] = o.order_name || "Order";
    });

    // 4️⃣ Format response for frontend
    const formatted = invoices.map(inv => ({
      id: inv._id,
      transactionName: orderMap[inv.order_id] || "Order Invoice",
      orderId: inv.order_id,
      isDue: false, // invoices don’t store payment status yet
      createdAt: inv.created_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Customer transactions error:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = new mongoose.Types.ObjectId(req.params.id);

    const orders = await Order.find({ customer_id: customerId })
      .sort({ timestamp: -1 })
      .select("_id total_amount status payment_status timestamp items");

    const formatted = orders.map(order => ({
      id: order._id,
      orderId: order._id, // for UI clarity
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.timestamp,
      items: order.items
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch customer orders failed:", err);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
};