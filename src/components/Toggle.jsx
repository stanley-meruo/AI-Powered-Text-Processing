import { useState, useEffect } from "react";

const Toggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <div className="">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-1 rounded-md border border-gray-500 transition duration-300 bg-white text-gray-800 dark:bg-gray-800 md:p-2"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </>
  );
};
export default Toggle
