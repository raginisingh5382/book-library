import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filter, setFilter] = useState("all"); // all, borrowed, returned
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        const response = await axios.get("http://localhost:5000/api/borrow/my", config);
        setBorrowedBooks(response.data);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
        if (error.response?.status === 401) {
          alert("Session expired! Please login again.");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const filteredBooks = borrowedBooks.filter((borrow) => {
    if (filter === "borrowed") return borrow.status === "borrowed";
    if (filter === "returned") return borrow.status === "returned";
    return true; // all
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDaysHeld = (borrowDate, returnDate) => {
    const start = new Date(borrowDate);
    const end = returnDate ? new Date(returnDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your borrow history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📚 My Borrow History
        </h1>
        <p className="text-gray-600 mb-6">
          View all your borrowed books with dates and status
        </p>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({borrowedBooks.length})
            </button>
            <button
              onClick={() => setFilter("borrowed")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "borrowed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Currently Borrowed ({borrowedBooks.filter(b => b.status === "borrowed").length})
            </button>
            <button
              onClick={() => setFilter("returned")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "returned"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Returned ({borrowedBooks.filter(b => b.status === "returned").length})
            </button>
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredBooks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-lg font-medium">No books found</p>
              <p className="text-sm">
                {filter === "all"
                  ? "You haven't borrowed any books yet."
                  : filter === "borrowed"
                  ? "You don't have any books currently borrowed."
                  : "You haven't returned any books yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Book Details
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Borrow Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Return Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Days Held
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.map((borrow) => (
                    <tr key={borrow._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {borrow.book?.title || "Unknown Book"}
                          </p>
                          <p className="text-sm text-gray-600">
                            by {borrow.book?.author || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {borrow.book?.genre || ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">
                          {formatDate(borrow.borrowDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(borrow.borrowDate).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {borrow.returnDate ? (
                          <>
                            <p className="text-sm text-gray-700">
                              {formatDate(borrow.returnDate)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(borrow.returnDate).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Not returned yet</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-700">
                          {calculateDaysHeld(borrow.borrowDate, borrow.returnDate)} days
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            borrow.status === "borrowed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {borrow.status === "borrowed" ? "📖 Borrowed" : "✓ Returned"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {borrowedBooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Total Books Borrowed</p>
              <p className="text-2xl font-bold text-blue-600">{borrowedBooks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Currently Reading</p>
              <p className="text-2xl font-bold text-green-600">
                {borrowedBooks.filter(b => b.status === "borrowed").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Books Returned</p>
              <p className="text-2xl font-bold text-gray-600">
                {borrowedBooks.filter(b => b.status === "returned").length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
