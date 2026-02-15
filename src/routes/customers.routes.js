import express from "express";
import {
  getAllCustomers,
  getCustomerOrders,
  getCustomerTransactions
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id/transactions", getCustomerTransactions);
router.get("/:id/orders", getCustomerOrders);

export default router;
