import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import Inventory from "../models/Inventory.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const customerCount = await Customer.countDocuments();
    const inventoryCount = await Inventory.countDocuments();

    const txns = await Transaction.find({});

    let totalPaid = 0;
    let totalDueCreated = 0;

    txns.forEach((t) => {
      const amount = Number(t.amount) || 0;
      const type = (t.type || "").toUpperCase().trim();

      if (type === "PAID") totalPaid += amount;
      if (type === "DUE") totalDueCreated += amount;
    });

    const currentDue = Math.max(totalDueCreated - totalPaid, 0);

    res.json({
      totalSales: totalPaid,
      currentDue,
      customerCount,
      inventoryCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard summary failed" });
  }
};





export const getTransactionsPaginated = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "customer_id",
          select: "name phone",
        }),
      Transaction.countDocuments(),
    ]);

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


export const getDueSummary = async (req, res) => {
  try {
    const txns = await Transaction.find({})
      .populate({
        path: "customer_id",
        select: "name telegram_id",
      });

    // Group by order (or description fallback)
    const ledger = {};

    txns.forEach((t) => {
      const key = t.order_id || t.description || "UNKNOWN";

      if (!ledger[key]) {
        ledger[key] = {
          orderId: key,
          customerName: t.customer_id?.name || "Unknown",
          telegramId: t.customer_id?.telegram_id || "—",
          due: 0,
          date: t.timestamp,
        };
      }

      const amount = Number(t.amount) || 0;
      const type = (t.type || "").toUpperCase().trim();

      if (type === "DUE") ledger[key].due += amount;
      if (type === "PAID") ledger[key].due -= amount;
    });

    const result = Object.values(ledger).map((l) => ({
      ...l,
      status: l.due > 0 ? "NOT CLEARED" : "CLEARED",
      amount: Math.max(l.due, 0),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch due summary" });
  }
};



export const getDueTimeline = async (req, res) => {
  try {
    const txns = await Transaction.find({})
      .sort({ timestamp: 1 });

    let runningDue = 0;
    const timeline = [];

    txns.forEach((t) => {
      const date = new Date(t.timestamp).toISOString().slice(0, 10);
      const amount = Number(t.amount) || 0;
      const type = (t.type || "").toUpperCase().trim();

      if (type === "DUE") runningDue += amount;
      if (type === "PAID") runningDue -= amount;

      timeline.push({
        date,
        netDue: Math.max(runningDue, 0),
      });
    });

    res.json(timeline);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch due timeline" });
  }
};

