import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BorrowedBooks from "./pages/BorrowedBooks";
import { getCurrentUser } from "./utils/auth";

function AppContent() {
  const [user, setUser] = useState(getCurrentUser());
  const location = useLocation();

  useEffect(() => {
    const current = getCurrentUser();
    console.log(current);
    setUser(current);
  }, [location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : user.role === "admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/user-dashboard" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/user-dashboard"
          element={
            user?.role === "user" ? <UserDashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="/borrowed" element={<BorrowedBooks />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
