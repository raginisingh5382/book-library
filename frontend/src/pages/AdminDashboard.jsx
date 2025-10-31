import { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    totalCopies: "",
  });

  // ✅ Use Vite environment variable
  const API = import.meta.env.VITE_API_URI;

  // Fetch all books & borrowed records from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getCurrentUser();
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        const booksRes = await axios.get(`${API}/api/books`);
        const borrowedRes = await axios.get(`${API}/api/borrow`, config);

        setBooks(booksRes.data);
        setBorrowedBooks(borrowedRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
        if (error.response?.status === 401) {
          alert("Session expired! Please login again.");
          window.location.href = "/login";
        } else {
          alert("Failed to load data from server!");
        }
      }
    };
    fetchData();
  }, [API]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or Update Book
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.genre || !formData.totalCopies) {
      alert("Please fill in all fields!");
      return;
    }

    const copies = parseInt(formData.totalCopies);
    if (isNaN(copies) || copies < 1) {
      alert("Total copies must be a positive number!");
      return;
    }

    try {
      const user = getCurrentUser();
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      if (editingBook) {
        await axios.put(
          `${API}/api/books/${editingBook._id}`,
          { ...formData, totalCopies: copies },
          config
        );
        alert("Book updated successfully!");
      } else {
        await axios.post(
          `${API}/api/books`,
          { ...formData, totalCopies: copies },
          config
        );
        alert("Book added successfully!");
      }

      const res = await axios.get(`${API}/api/books`);
      setBooks(res.data);

      setFormData({ title: "", author: "", genre: "", totalCopies: "" });
      setEditingBook(null);
    } catch (error) {
      console.error("Error saving book:", error);
      if (error.response?.status === 401) {
        alert("Session expired! Please login again.");
        window.location.href = "/login";
      } else {
        alert(error.response?.data?.message || "Failed to save book!");
      }
    }
  };

  // Edit Book
  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      totalCopies: book.totalCopies,
    });
  };

  // Delete Book
  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const user = getCurrentUser();
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      await axios.delete(`${API}/api/books/${bookId}`, config);
      alert("Book deleted successfully!");
      setBooks(books.filter((b) => b._id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
      if (error.response?.status === 401) {
        alert("Session expired! Please login again.");
        window.location.href = "/login";
      } else {
        alert("Failed to delete book!");
      }
    }
  };

  // Borrowed / Available count helpers
  const getBorrowedCount = (bookId) =>
    borrowedBooks.filter((b) => b.book._id === bookId && b.status === "borrowed").length;

  const getAvailableCopies = (book) =>
    Math.max(0, book.totalCopies - getBorrowedCount(book._id));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        📚 Admin Dashboard
      </h1>

      {/* Add / Edit Book Form */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingBook ? "✏ Edit Book" : "➕ Add New Book"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="totalCopies"
            placeholder="Total Copies"
            value={formData.totalCopies}
            onChange={handleChange}
            min="1"
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {editingBook ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>

      {/* Books Table */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📖 Book List</h2>

        {books.length === 0 ? (
          <p className="text-gray-500 text-center">No books available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Author</th>
                  <th className="border p-2">Genre</th>
                  <th className="border p-2 text-center">Total Copies</th>
                  <th className="border p-2 text-center">Borrowed</th>
                  <th className="border p-2 text-center">Available</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const borrowed = getBorrowedCount(book._id);
                  const available = getAvailableCopies(book);
                  return (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="border p-2">{book.title}</td>
                      <td className="border p-2">{book.author}</td>
                      <td className="border p-2">{book.genre}</td>
                      <td className="border p-2 text-center">{book.totalCopies}</td>
                      <td className="border p-2 text-center">{borrowed}</td>
                      <td className="border p-2 text-center">{available}</td>
                      <td className="border p-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


