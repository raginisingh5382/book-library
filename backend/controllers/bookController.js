import Book from "../models/bookModel.js";

// Add new book (Admin)
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, totalCopies } = req.body;

    const newBook = await Book.create({
      title,
      author,
      genre,
      totalCopies,
      availableCopies: totalCopies, // initially all available
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all books (Public)
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update book (Admin)
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete book (Admin)
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
