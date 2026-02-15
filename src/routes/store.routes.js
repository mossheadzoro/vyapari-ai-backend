import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMyStores, createStore } from "../controllers/store.controller.js";

const router = express.Router();

router.get("/", protect, getMyStores);
router.post("/", protect, createStore);

export default router;
