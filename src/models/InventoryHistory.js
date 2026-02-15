import mongoose from "mongoose";

const inventoryHistorySchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true },
    change: { type: Number, required: true }, // +5 or -3
    type: { type: String, enum: ["IN", "OUT"], required: true },
    previous_qty: Number,
    new_qty: Number,
  },
  { timestamps: true }
);

export default mongoose.model(
  "InventoryHistory",
  inventoryHistorySchema,
  "inventory_history"
);
