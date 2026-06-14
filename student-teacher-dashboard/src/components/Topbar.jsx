import { useState, useRef, useEffect } from "react";
import {
  Search,
  MessageCircle,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // ✅ TEACHER DATA
  const teacher =
    JSON.parse(
      localStorage.getItem("loggedInTeacher")
    ) || {
      name: "Teacher",
      email: "teacher@gmail.com",
    };

  const teacherName =
    teacher.name || "Teacher";

  const teacherEmail =
    teacher.email || "teacher@gmail.com";

  // ✅ LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // ✅ LOAD THEME
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

  // ✅ TOGGLE THEME
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
    navigate("/teacher/inbox");
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm transition-all duration-300">

      {/* ✅ LEFT SECTION */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl w-[320px] border border-gray-200 dark:border-gray-700">

          <Search
            size={18}
            className="text-gray-500 dark:text-gray-400"
          />

          <input
            type="text"
            placeholder="Search students, courses..."
            className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* ✅ RIGHT SECTION */}
      <div
        className="flex items-center gap-4 relative"
        ref={dropdownRef}
      >

        {/* DATE & TIME */}
        <div className="hidden xl:flex flex-col items-end mr-2">

          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {currentTime.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </span>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentTime.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>
        </div>

        {/* DARK MODE */}
        <button
          onClick={toggleDarkMode}
          className="h-11 w-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition-all border border-gray-200 dark:border-gray-700"
        >
          {darkMode ? (
            <Sun
              size={18}
              className="text-yellow-400"
            />
          ) : (
            <Moon
              size={18}
              className="text-gray-700 dark:text-white"
            />
          )}
        </button>

        {/* INBOX */}
        <button
          onClick={handleInbox}
          className="relative h-11 w-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition-all border border-gray-200 dark:border-gray-700"
        >
          <MessageCircle
            size={18}
            className="text-gray-700 dark:text-white"
          />

          {/* ACTIVE DOT */}
          <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* PROFILE */}
        <div
          onClick={() =>
            setDropdownOpen(!dropdownOpen)
          }
          className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 pl-3 pr-4 py-2 rounded-2xl cursor-pointer hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
        >

          {/* AVATAR */}
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow">
            {teacherName
              .charAt(0)
              .toUpperCase()}
          </div>

          {/* INFO */}
          <div className="hidden md:flex flex-col leading-tight">

            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {teacherName}
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {teacherEmail}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-300 ${
              dropdownOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </div>

        {/* ✅ DROPDOWN */}
        {dropdownOpen && (
          <div className="absolute right-0 top-16 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border border-white/20">
                  {teacherName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    {teacherName}
                  </h3>

                  <p className="text-sm text-blue-100">
                    {teacherEmail}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    Active Session
                  </div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-4">

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Teacher Dashboard
                </h4>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Manage students, assignments,
                  attendance, placements, and
                  academic records securely from
                  the dashboard panel.
                </p>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 py-3 rounded-2xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
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

export default Topbar;