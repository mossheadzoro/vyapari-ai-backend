import express from "express";
import { getInventory, getInventoryHistory, updateQuantity } from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/", getInventory);
router.patch("/:id/quantity", updateQuantity);
router.get("/history/log", getInventoryHistory);

export default router;
