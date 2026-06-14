import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Context
import { AttendanceProvider } from "./context/AttendanceContext";

// Pages
import Login from "./pages/Login";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentsPage from "./pages/StudentsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import TimeTablePage from "./pages/TimeTablePage";
import CalendarPage from "./pages/CalendarPage";
import ExaminationsPage from "./pages/ExaminationsPage";
import ResultsPage from "./pages/ResultsPage";
import AttendancePage from "./pages/AttendancePage";
import LibraryBooksPage from "./pages/LibraryBooksPage";
import TeacherInbox from "./pages/TeacherInbox";
import TeacherFee from "./pages/TeacherFee";
import TeacherStudyMaterial from "./pages/TeacherStudyMaterial";

// 🔥 NEW Placement Page
import PlacementDashboard from "./pages/PlacementDashboard";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentAssignments from "./pages/StudentAssignments";
import StudentExamTimetable from "./pages/StudentExamTimetable";
import StudentResults from "./pages/StudentResults";
import StudentAttendance from "./pages/StudentAttendance";
import StudentCalendar from "./pages/StudentCalendar";
import StudentsTimetable from "./pages/StudentsTimetable";
import StudentLibrary from "./pages/StudentLibrary";
import StudentInbox from "./pages/StudentInbox";
import StudentFee from "./pages/StudentFee";
import StudentStudyMaterial from "./pages/StudentStudyMaterial";
import StudentPlacement from "./pages/StudentPlacement";

export default function App() {
  const [students, setStudents] = useState([
    { id: 1, name: "Aarav Sharma", roll: "01", course: "JavaScript" },
    { id: 2, name: "Diya Patel", roll: "02", course: "React" },
    { id: 3, name: "Rohan Kumar", roll: "03", course: "Python" },
  ]);

  const [books, setBooks] = useState([
    { id: 1, title: "JavaScript Basics", author: "John Doe", issuedTo: "" },
    { id: 2, title: "React in Depth", author: "Jane Smith", issuedTo: "" },
    { id: 3, title: "Python Programming", author: "Mike Ross", issuedTo: "" },
  ]);

  return (
    <AttendanceProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          
          {/* Main Content */}
          <div className="flex-1">
            <Routes>

              {/* Login */}
              <Route path="/" element={<Login />} />

              {/* ================= TEACHER ROUTES ================= */}

              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/placement" element={<PlacementDashboard />} />

              <Route
                path="/students"
                element={
                  <StudentsPage students={students} setStudents={setStudents} />
                }
              />

              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/timetable" element={<TimeTablePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/examinations" element={<ExaminationsPage />} />
              <Route path="/results" element={<ResultsPage />} />

              <Route
                path="/attendance"
                element={<AttendancePage students={students} />}
              />

              <Route
                path="/library"
                element={<LibraryBooksPage books={books} setBooks={setBooks} />}
              />

              <Route path="/teacher/inbox" element={<TeacherInbox />} />

              <Route
                path="/teacher/fees"
                element={<TeacherFee students={students} />}
              />

              <Route
                path="/teacher/study-material"
                element={<TeacherStudyMaterial />}
              />

              {/* ================= STUDENT ROUTES ================= */}

              <Route
                path="/student"
                element={<Navigate to="/student/dashboard" replace />}
              />

              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/exams" element={<StudentExamTimetable />} />
              <Route path="/student/results" element={<StudentResults />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/calendar" element={<StudentCalendar />} />
              <Route path="/student/timetable" element={<StudentsTimetable />} />
              <Route path="/student/library" element={<StudentLibrary />} />
              <Route path="/student/inbox" element={<StudentInbox studentId={1} />} />
              <Route path="/student/placement" element={<StudentPlacement />} />

              <Route
                path="/student/fees"
                element={
                  <StudentFee
                    studentId={1}
                    studentName="Aarav Sharma"
                  />
                }
              />

              <Route
                path="/student/study-material"
                element={<StudentStudyMaterial />}
              />

            </Routes>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-400 text-base py-2">
            Designed & Developed with ❤️ by{" "}
            <span className="font-semibold">Yashika</span>
          </footer>

        </div>
      </BrowserRouter>
    </AttendanceProvider>
  );
}