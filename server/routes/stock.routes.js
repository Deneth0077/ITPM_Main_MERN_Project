import express from "express";
import {
  createStock,
  getAllStock,
  getStockDetail,
  updateStock,
  deleteStock,
} from "../controllers/stock.controller.js";
import upload from "../config/multerConfig.js"; // Updated import

const router = express.Router();

router.route("/").get(getAllStock);
router.route("/").post(upload.single("image"), createStock); // Add image upload
router.route("/:id").get(getStockDetail);
router.route("/:id").patch(upload.single("image"), updateStock);
router.route("/:id").delete(deleteStock);

export default router;