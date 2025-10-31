import express from "express";
import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
} from "../controllers/borrowController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/borrow/:bookId", protect, borrowBook);
router.post("/return/:borrowId", protect, returnBook);
router.get("/my", protect, getMyBorrows);
router.get("/", protect, adminOnly, getAllBorrows);

export default router;
