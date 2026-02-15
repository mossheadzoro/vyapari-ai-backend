import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // keep snake_case if DB already uses it
    telegram_id: {
      type: String,
    },
  },
  {
    timestamps: true, // 🔥 THIS CREATES createdAt / updatedAt
  }
);

export default mongoose.model("Customer", customerSchema);
