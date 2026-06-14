// src/components/StudentTopbar.jsx

import { useState, useRef, useEffect } from "react";
import {
  Search,
  MessageCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentTopbar = () => {
  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // ✅ DYNAMIC STUDENT DATA
  const student =
    JSON.parse(
      localStorage.getItem("loggedInStudent")
    ) ||
    JSON.parse(localStorage.getItem("student")) || {
      name: "Student",
      email: "student@example.com",
    };

  const studentName =
    student.name || "Student";

  const studentEmail =
    student.email || "student@example.com";

  // ✅ CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ✅ LOAD SAVED THEME
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add(
        "dark"
      );

      setDarkMode(true);
    }
  }, []);

  // ✅ TOGGLE DARK MODE
  const toggleDarkMode = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }

    localStorage.setItem(
      "theme",
      newMode ? "dark" : "light"
    );
  };

  // ✅ OPEN INBOX
  const handleInbox = () => {
    navigate("/student/inbox");
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between transition-all duration-300">

      {/* ✅ SEARCH */}
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl w-[300px]">

        <Search
          size={20}
          className="text-gray-500 dark:text-gray-300"
        />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm text-black dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* ✅ RIGHT SECTION */}
      <div
        className="flex items-center gap-5 relative"
        ref={dropdownRef}
      >

        {/* ✅ DARK MODE */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-all"
        >
          {darkMode ? (
            <Sun
              size={20}
              className="text-yellow-400"
            />
          ) : (
            <Moon
              size={20}
              className="text-gray-700 dark:text-white"
            />
          )}
        </button>

        {/* ✅ INBOX */}
        <button
          onClick={handleInbox}
          className="relative p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-all"
        >
          <MessageCircle
            size={20}
            className="text-gray-700 dark:text-white"
          />

          {/* ACTIVE DOT */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500"></span>
        </button>

        {/* ✅ PROFILE */}
        <div
          className="flex items-center gap-3 cursor-pointer bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl hover:shadow-lg transition-all duration-300"
          onClick={() =>
            setDropdownOpen(!dropdownOpen)
          }
        >

          {/* ✅ AVATAR */}
          <div className="h-11 w-11 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {studentName.charAt(0).toUpperCase()}
          </div>

          {/* ✅ INFO */}
          <div className="hidden md:flex flex-col leading-tight">

            <span className="font-semibold text-sm text-gray-800 dark:text-white">
              {studentName}
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-300">
              {studentEmail}
            </span>
          </div>
        </div>

        {/* ✅ PROFILE DROPDOWN */}
        {dropdownOpen && (
          <div className="absolute right-0 top-16 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700 z-50">

            {/* ✅ HEADER */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 text-white">

              <div className="flex items-center gap-4">

                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold border border-white/30">
                  {studentName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    {studentName}
                  </h3>

                  <p className="text-sm text-pink-100">
                    {studentEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ MENU */}
            <div className="py-2">

              <div className="px-5 py-3 border-b dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Student Dashboard Access
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTopbar;