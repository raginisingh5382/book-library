import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth";

export default function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-md">
      <h1 className="font-bold text-xl">📚 Library System</h1>
      <div className="space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:underline">Admin Panel</Link>
            )}
            {user.role === "user" && (
              <>
                <Link to="/user" className="hover:underline">Books</Link>
                <Link to="/borrowed" className="hover:underline">My Borrowed</Link>
              </>
            )}
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
