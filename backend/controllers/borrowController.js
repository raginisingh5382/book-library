import Borrow from "../models/borrowModel.js";
import Book from "../models/bookModel.js";

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id; // from protect middleware

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.totalCopies <= 0)
      return res.status(400).json({ message: "No copies available" });

    // Check if already borrowed
    const alreadyBorrowed = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: "borrowed",
    });

    if (alreadyBorrowed)
      return res
        .status(400)
        .json({ message: "You already borrowed this book" });

    // Decrease available copies
    book.totalCopies -= 1;
    await book.save();

    // Create borrow record
    const borrowRecord = await Borrow.create({
      user: userId,
      book: bookId,
      borrowDate: new Date(),
      status: "borrowed",
    });

    res.status(201).json({
      message: "Book borrowed successfully!",
      borrowRecord,
    });
  } catch (error) {
    console.error("Borrow Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Return a borrowed book
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const record = await Borrow.findById(borrowId);
    if (!record)
      return res.status(404).json({ message: "Borrow record not found" });

    if (record.status === "returned")
      return res.status(400).json({ message: "Book already returned" });

    // Mark as returned
    record.status = "returned";
    record.returnDate = new Date();
    await record.save();

    // Increase total copies
    const book = await Book.findById(record.book);
    if (book) {
      book.totalCopies += 1;
      await book.save();
    }

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    console.error("Return Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all borrow records (Admin)
export const getAllBorrows = async (req, res) => {
  try {
    const records = await Borrow.find()
      .populate("book")
      .populate("user", "name email")
      .sort({ borrowDate: -1 });
    res.json(records);
  } catch (error) {
    console.error("Get All Borrows Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get my borrowed books (User)
export const getMyBorrows = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware

    const borrows = await Borrow.find({ user: userId })
      .populate("book")
      .sort({ borrowDate: -1 });
    res.json(borrows);
  } catch (error) {
    console.error("Get My Borrows Error:", error);
    res.status(500).json({ message: error.message });
  }
};



