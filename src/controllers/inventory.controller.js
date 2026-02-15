import Inventory from "../models/Inventory.js";
import InventoryHistory from "../models/InventoryHistory.js";

/**
 * GET /api/inventory
 */
export const getInventory = async (req, res) => {
  const { search } = req.query;

  const query = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const items = await Inventory.find(query).sort({ name: 1 });

  res.json(
    items.map(i => ({
      id: i._id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      status: i.quantity > 0 ? "AVAILABLE" : "OUT OF STOCK",
    }))
  );
};

/**
 * PATCH /api/inventory/:id/quantity
 */
export const updateQuantity = async (req, res) => {
  const { delta } = req.body; // +1 / -1 / +5 etc

  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  const previous = item.quantity;
  const updated = Math.max(0, previous + delta);

  item.quantity = updated;
  await item.save();

  await InventoryHistory.create({
    item_name: item.name,
    change: delta,
    type: delta > 0 ? "IN" : "OUT",
    previous_qty: previous,
    new_qty: updated,
  });

  res.json({ success: true });
};

/**
 * GET /api/inventory/history
 */
export const getInventoryHistory = async (req, res) => {
  const history = await InventoryHistory.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(history);
};
