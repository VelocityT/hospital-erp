import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    current: localStorage.getItem("theme") || "light", // default to light
  },
  reducers: {
    toggleTheme: (state) => {
      state.current = state.current === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.current);
      document.documentElement.classList.toggle("dark", state.current === "dark");
      window.theme = state.current;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
