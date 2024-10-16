import { createSlice } from "@reduxjs/toolkit";

// Retrieve role from localStorage under "name"
let userRole = "";
const storedRole = localStorage.getItem("name");

if (storedRole && storedRole !== "undefined") {
  try {
    userRole = JSON.parse(storedRole);
  } catch (error) {
    console.warn("Failed to parse stored role:", error);
    userRole = ""; // Default to empty string if parsing fails
  }
}

const initialState = {
  isLoggedIn: false,
  name: userRole, // Keep name as the field representing role
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
    UserRole: userRole,
    privileges: {}, // Add privileges to the initial state
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) { // Keep SET_NAME
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload; // Update name in state as role
    },
    SET_USER(state, action) {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
      state.user.phone = profile.phone;
      state.user.bio = profile.bio;
      state.user.photo = profile.photo;
      state.user.UserRole = profile.UserRole;
      state.user.privileges = profile.privileges || {}; // Populate privileges from profile data
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name || "User"; // Continue to use selectName as role
export const selectUser = (state) => state.auth.user; // Added to select user object

// Selector to check if the user has deletion privileges
export const selectCanDelete = (state, permissionType) => {
  const { privileges } = state.auth.user;
  const isAdmin = state.auth.name === "Admin"; // Check if the name (used as role) is Admin
  return isAdmin || privileges?.[permissionType] === true; // Admins have all privileges
};

export default authSlice.reducer;
