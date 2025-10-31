import express from "express";
import { addBook, getAllBooks, updateBook, deleteBook } from "../controllers/bookController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// public route
router.get("/", getAllBooks);

// admin routes
router.post("/", protect, adminOnly, addBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;
