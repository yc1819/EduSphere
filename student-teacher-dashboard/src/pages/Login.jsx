import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EdusphereBg from "../assets/Edusphere.jpg";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");

  // ✅ ONLY ADDED
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // ✅ ONLY ADDED
  const courses = {
    undergraduate: ["BCA", "BBA", "BCom", "BJMC", "BMS", "BTech", "BSc", "MBBS"],
    postgraduate: ["MCA", "MBA", "MCom", "MTech"],
  };

  // ✅ UPDATED LOGIN LOGIC (ONLY CHANGE)
  const handleSubmit = (e) => {
    e.preventDefault();

    const users = [
      { email: "teacher@gmail.com", password: "teacher123", role: "teacher" },
      { email: "student@gmail.com", password: "student123", role: "student" },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "teacher") {
      setShowTeacherModal(true); // ✅ changed
    } else {
      setShowStudentModal(true);
    }
  };

  const submitStudentDetails = () => {
    if (!studentName || !studentRoll) {
      alert("Please fill required details.");
      return;
    }

    localStorage.setItem("student_name", studentName);
    localStorage.setItem("student_roll", studentRoll);
    localStorage.setItem("currentStudentId", studentRoll);

    navigate("/student");
  };

  // ✅ ONLY ADDED
  const handleTeacherContinue = () => {
    if (!selectedLevel || !selectedCourse) {
      alert("Please select course");
      return;
    }

    localStorage.setItem("teacher_level", selectedLevel);
    localStorage.setItem("teacher_course", selectedCourse);

    navigate("/teacher");
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#00ffff" },
      links: { enable: true, color: "#00ffff", distance: 120 },
      move: { enable: true, speed: 1.5 },
      number: { value: 50 },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  // ---------------- WELCOME SCREEN ----------------
  if (showWelcome) {
    return (
      <>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />

        <div className="min-h-screen flex justify-center items-center relative z-10">
          <div className="bg-black/70 backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
            <img
              src={EdusphereBg}
              alt="EduSphere Logo"
              className="w-24 h-24 mx-auto mb-6 rounded-full object-cover"
            />

            <h1 className="text-5xl font-extrabold text-white mb-6">
              Welcome to <span className="text-cyan-400">EduSphere</span>
            </h1>

            <p className="text-gray-300 mb-8">
              Smarter, faster, AI-driven learning platform for the next
              generation of students.
            </p>

            <button
              onClick={() => setShowWelcome(false)}
              className="bg-cyan-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition"
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  // ---------------- LOGIN PAGE ----------------
  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      <div className="min-h-screen flex relative z-10">

        <div className="hidden md:flex w-1/2 relative items-center justify-center text-white p-12 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
            style={{ backgroundImage: `url(${EdusphereBg})` }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/70"></div>

          <div className="relative z-10 max-w-md">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-cyan-400">EduSphere</span>
            </h1>

            <p className="text-lg text-gray-200">
              Smarter, faster, AI-driven learning platform for the next
              generation of students.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
          <div
            className={`bg-gray-800 text-white shadow-2xl p-10 rounded-3xl w-full max-w-md transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
            }`}
          >
            <h2 className="text-3xl font-bold text-center mb-6">
              EduSphere Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="email"
                placeholder="teacher@gmail.com / student@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-cyan-400/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-cyan-400/40"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button className="w-full py-3 bg-cyan-400 text-gray-900 font-bold rounded-xl">
                Log In
              </button>
            </form>

            <div className="mt-6 bg-black p-4 rounded-xl text-sm">
              <p className="mb-2 font-semibold">Demo Access</p>
              <p>👩‍🏫 Teacher — teacher@gmail.com / teacher123</p>
              <p>👨‍🎓 Student — student@gmail.com / student123</p>
            </div>
          </div>
        </div>
      </div>

      {/* STUDENT MODAL (UNCHANGED) */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-xl text-white mb-4 text-center">
              Verify Details
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 px-4 py-3 rounded bg-gray-800 text-white"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Roll Number"
              className="w-full mb-4 px-4 py-3 rounded bg-gray-800 text-white"
              value={studentRoll}
              onChange={(e) => setStudentRoll(e.target.value)}
            />

            <button
              onClick={submitStudentDetails}
              className="w-full bg-cyan-400 text-gray-900 py-3 rounded font-bold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ✅ ONLY NEW ADDITION */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md text-white">

            <h2 className="text-xl mb-4 text-center">
              Select Course
            </h2>

            <select
              className="w-full mb-4 px-4 py-3 rounded bg-gray-800 text-white"
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedCourse("");
              }}
            >
              <option value="">Select Level</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>

            {selectedLevel && (
              <select
                className="w-full mb-4 px-4 py-3 rounded bg-gray-800 text-white"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses[selectedLevel].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleTeacherContinue}
              className="w-full bg-cyan-400 text-gray-900 py-3 rounded font-bold"
            >
              Continue
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default Login;