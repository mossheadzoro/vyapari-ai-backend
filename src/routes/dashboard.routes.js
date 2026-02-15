import express from "express";
import {
  getDashboardSummary,
  getDueSummary,
  getDueTimeline,
  getTransactionsPaginated
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// Summary (sales, current due, counts)
router.get("/summary", getDashboardSummary);

// Paginated transactions (order-linked)
router.get("/transactions", getTransactionsPaginated);

// 🔥 NEW
router.get("/dues/summary", getDueSummary);
router.get("/dues/timeline", getDueTimeline);



export default router;
