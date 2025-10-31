import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filter, setFilter] = useState("all");
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

        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/api/borrow/my`,
          config
        );
        setBorrowedBooks(response.data);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
        if (error.response?.status === 401) {
          alert("Session expired! Please login again.");
          window.location.href = "/login";
        } else {
          alert("Failed to load borrow history!");
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
    return true;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const calculateDaysHeld = (borrowDate, returnDate) => {
    const start = new Date(borrowDate);
    const end = returnDate ? new Date(returnDate) : new Date();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff;
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
            {["all", "borrowed", "returned"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === tab
                    ? tab === "borrowed"
                      ? "bg-green-600 text-white"
                      : tab === "returned"
                      ? "bg-gray-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab === "all" && `All (${borrowedBooks.length})`}
                {tab === "borrowed" &&
                  `Currently Borrowed (${
                    borrowedBooks.filter((b) => b.status === "borrowed").length
                  })`}
                {tab === "returned" &&
                  `Returned (${
                    borrowedBooks.filter((b) => b.status === "returned").length
                  })`}
              </button>
            ))}
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredBooks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
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
                        <p className="font-semibold text-gray-800">
                          {borrow.book?.title || "Unknown Book"}
                        </p>
                        <p className="text-sm text-gray-600">
                          by {borrow.book?.author || "Unknown Author"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {borrow.book?.genre || ""}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {formatDate(borrow.borrowDate)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {borrow.returnDate
                          ? formatDate(borrow.returnDate)
                          : "Not returned yet"}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700">
                        {calculateDaysHeld(
                          borrow.borrowDate,
                          borrow.returnDate
                        )}{" "}
                        days
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            borrow.status === "borrowed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {borrow.status === "borrowed"
                            ? "📖 Borrowed"
                            : "✓ Returned"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

