import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js";
import customerRoutes from "./routes/customers.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);


app.use("/api/inventory", inventoryRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
