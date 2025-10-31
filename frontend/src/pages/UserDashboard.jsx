import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const user = getCurrentUser();

  // Load books and user's borrowed books from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        // Get all books
        const booksRes = await axios.get("http://localhost:5000/api/books");
        setBooks(booksRes.data);

        // Get user's borrowed books
        const borrowedRes = await axios.get("http://localhost:5000/api/borrow/my", config);
        setBorrowedBooks(borrowedRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
        if (error.response?.status === 401) {
          alert("Session expired! Please login again.");
          window.location.href = "/login";
        } else {
          alert("Failed to load books or borrowed data.");
        }
      }
    };

    fetchData();
  }, []);

  // Handle Borrow Book
  const handleBorrow = async (bookId) => {
    try {
      // Check if already borrowed
      const alreadyBorrowed = borrowedBooks.some(
        (b) => b.book._id === bookId && b.status === "borrowed"
      );
      if (alreadyBorrowed) {
        alert("You already borrowed this book!");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      // Borrow API call
      const response = await axios.post(
        `http://localhost:5000/api/borrow/borrow/${bookId}`,
        {},
        config
      );

      alert(response.data.message || "Book borrowed successfully!");

      // Refresh book and borrowed data
      const booksRes = await axios.get("http://localhost:5000/api/books");
      setBooks(booksRes.data);

      const borrowedRes = await axios.get("http://localhost:5000/api/borrow/my", config);
      setBorrowedBooks(borrowedRes.data);
    } catch (error) {
      console.error("Borrow Error:", error);
      if (error.response?.status === 401) {
        alert("Session expired! Please login again.");
        window.location.href = "/login";
      } else {
        alert(error.response?.data?.message || "Failed to borrow the book!");
      }
    }
  };

  // Handle Return Book
  const handleReturn = async (borrowId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:5000/api/borrow/return/${borrowId}`,
        {},
        config
      );
      alert(response.data.message || "Book returned successfully!");

      // Refresh lists
      const booksRes = await axios.get("http://localhost:5000/api/books");
      setBooks(booksRes.data);

      const borrowedRes = await axios.get("http://localhost:5000/api/borrow/my", config);
      setBorrowedBooks(borrowedRes.data);
    } catch (error) {
      console.error("Return Error:", error);
      if (error.response?.status === 401) {
        alert("Session expired! Please login again.");
        window.location.href = "/login";
      } else {
        alert(error.response?.data?.message || "Failed to return book!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📖 User Dashboard
      </h1>

      {/* Available Books */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          📚 Available Books
        </h2>

        {books.length === 0 ? (
          <p className="text-gray-500 text-center">No books available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Author</th>
                  <th className="border p-2">Genre</th>
                  <th className="border p-2 text-center">Available Copies</th>
                  <th className="border p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const isBorrowed = borrowedBooks.some(
                    (b) => b.book._id === book._id && b.status === "borrowed"
                  );
                  return (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="border p-2">{book.title}</td>
                      <td className="border p-2">{book.author}</td>
                      <td className="border p-2">{book.genre}</td>
                      <td className="border p-2 text-center">{book.totalCopies}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleBorrow(book._id)}
                          disabled={book.totalCopies === 0 || isBorrowed}
                          className={`px-3 py-1 rounded text-white ${
                            book.totalCopies === 0 || isBorrowed
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {isBorrowed ? "Already Borrowed" : book.totalCopies === 0 ? "Not Available" : "Borrow"}
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

      {/* Borrowed Books */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          📘 My Borrowed Books
        </h2>

        {borrowedBooks.filter(b => b.status === "borrowed").length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven't borrowed any books yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Author</th>
                  <th className="border p-2">Genre</th>
                  <th className="border p-2">Borrow Date</th>
                  <th className="border p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks
                  .filter(b => b.status === "borrowed")
                  .map((borrow) => (
                    <tr key={borrow._id} className="hover:bg-gray-50">
                      <td className="border p-2">{borrow.book?.title || "N/A"}</td>
                      <td className="border p-2">{borrow.book?.author || "N/A"}</td>
                      <td className="border p-2">{borrow.book?.genre || "N/A"}</td>
                      <td className="border p-2">
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleReturn(borrow._id)}
                          className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

