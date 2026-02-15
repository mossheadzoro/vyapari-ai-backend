import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    default: "CONFIRMED",
  },
  payment_status: {
    type: String,
    enum: ["PAID", "PENDING"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  items: [orderItemSchema],
});

// ✅ CORRECT EXPORT
export default mongoose.model("Order", orderSchema);
