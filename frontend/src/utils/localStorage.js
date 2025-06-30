export const loadUser = () => {
  try {
    const userData = localStorage.getItem("user");
    // Fix: return null if not found, else parsed object
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
    return null;
  }
};

export const saveUser = (user) => {
  try {
    // Fix: save user object directly
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Failed to save user to localStorage:", error);
  }
};

export const clearUser = () => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Failed to clear user from localStorage:", error);
  }
};
