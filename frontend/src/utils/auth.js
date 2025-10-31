// src/utils/auth.js

// Save user to localStorage
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Save current logged-in user session
export const saveCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get current logged-in user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("user");
};
