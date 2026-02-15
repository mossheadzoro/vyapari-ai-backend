import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // 🔥 MUST match model name
    },
    amount: mongoose.Schema.Types.Mixed,
    type: String,
    description: String,
    timestamp: Date,
  },
  {
    collection: "transactions",
    strict: false,
  }
);

export default mongoose.model("Transaction", transactionSchema);
