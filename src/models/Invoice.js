import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    invoiceNumber: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
