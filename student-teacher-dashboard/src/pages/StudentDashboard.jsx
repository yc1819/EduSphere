import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import {
  Calendar,
  ArrowRight,
  Plus,
  BookOpen,
  Bell,
  BarChart,
  CreditCard,
} from "lucide-react";

import { getAssignments } from "../storage/assignmentsStorage";
import { getAttendance } from "../storage/attendanceStorage";
import { getTimetable } from "../storage/timetableStorage";
import { getResults } from "../storage/resultsStorage";
import { getStudents } from "../storage/studentsStorage";
import { getStudentFee, payFee } from "../storage/feeStorage";

const formatToday = () => new Date().toISOString().split("T")[0];

const StatTile = ({ title, value, subtitle, icon, linkTo, extra }) => (
  <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold mt-1">{value}</h2>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
        {extra && <div className="mt-2">{extra}</div>}
      </div>

      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
        {icon}
      </div>
    </div>

    {linkTo && (
      <div className="mt-4 flex justify-end">
        <Link
          to={linkTo}
          className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
        >
          View <ArrowRight size={14} />
        </Link>
      </div>
    )}
  </div>
);

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [fee, setFee] = useState({ totalAmount: 0, paidAmount: 0 });

  useEffect(() => {
    setAssignments(getAssignments() || []);
    setAttendanceRecords(getAttendance() || []);
    setTimetable(getTimetable() || []);
    setResults(getResults() || []);

    const students = getStudents() || [];
    const storedId = localStorage.getItem("currentStudentId");

    if (!storedId || !students.length) return;

    const selected = students.find(
      (s) =>
        String(s.id) === String(storedId) ||
        String(s.roll) === String(storedId)
    );

    setStudent(selected || null);

    if (selected) {
      const studentFee = getStudentFee(selected.id);
      setFee(studentFee || { totalAmount: 0, paidAmount: 0 });
    }
  }, []);

  const attendancePercent = useMemo(() => {
    if (!student) return 0;

    const last7 = attendanceRecords.slice(-7);
    let presentCount = 0;
    let total = 0;

    last7.forEach((record) => {
      if (!record) return;

      const pid = String(student.id);
      const isPresent = record.present?.includes(pid);

      if (isPresent !== undefined) {
        total++;
        if (isPresent) presentCount++;
      }
    });

    return total ? Math.round((presentCount / total) * 100) : 0;
  }, [attendanceRecords, student]);

  const resultsAverage = useMemo(() => {
    if (!student) return "—";

    const myResults = results.filter(
      (r) =>
        r.roll === student.roll ||
        r.name === student.name ||
        r.roll === student.id
    );

    if (!myResults.length) return "—";

    const numeric = myResults
      .map((r) => Number(r.grade))
      .filter((n) => !isNaN(n));

    if (!numeric.length) return "—";

    return (
      Math.round(numeric.reduce((a, b) => a + b, 0) / numeric.length) + "%"
    );
  }, [results, student]);

  const upcoming = useMemo(() => {
    if (!timetable.length) return [];

    const list = [];
    timetable.forEach((day) => {
      if (Array.isArray(day.slots)) {
        day.slots.forEach((slot) => {
          if (slot && slot !== "-") {
            list.push({ label: slot, day: day.day });
          }
        });
      }
    });

    return list.slice(0, 3);
  }, [timetable]);

  const unreadAbsences = useMemo(() => {
    if (!student) return 0;

    const today = formatToday();
    const todayRecord = attendanceRecords.find((r) => r.date === today);

    if (!todayRecord) return 0;

    const isPresent = todayRecord.present?.includes(String(student.id));
    return isPresent ? 0 : 1;
  }, [attendanceRecords, student]);

  const handleQuickPay = () => {
    const remaining = fee.totalAmount - fee.paidAmount;
    if (remaining <= 0) return alert("All fees paid");

    const amount = prompt(`Enter amount (Remaining ₹${remaining})`);
    const num = Number(amount);

    if (!num || num <= 0 || num > remaining) return alert("Invalid");

    payFee(student.id, num);
    setFee((prev) => ({ ...prev, paidAmount: prev.paidAmount + num }));
    alert("Payment successful");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <StudentTopbar />

        <main className="p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Hello,{" "}
                <span className="text-blue-600">
                  {student?.name || "Student"}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Roll: {student?.roll || student?.id || "—"}
              </p>
            </div>

            <div className="bg-white p-2 rounded-full shadow">
              <Bell size={20} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

            <StatTile
              title="Attendance"
              value={`${attendancePercent}%`}
              subtitle="Last 7 days"
              icon={<BarChart size={18} />}
              linkTo="/student/attendance"
            />

            <StatTile
              title="Results"
              value={resultsAverage}
              subtitle="Average"
              icon={<BookOpen size={18} />}
              linkTo="/student/results"
            />

            <StatTile
              title="Assignments"
              value={assignments.length}
              subtitle="Pending"
              icon={<Plus size={18} />}
              linkTo="/student/assignments"
            />

            <StatTile
              title="Missed Today"
              value={unreadAbsences}
              subtitle="Absence alert"
              icon={<Calendar size={18} />}
              linkTo="/student/attendance"
            />

            <StatTile
              title="Fee"
              value={`₹${fee.paidAmount}`}
              subtitle={`Pending ₹${fee.totalAmount - fee.paidAmount}`}
              icon={<CreditCard size={18} />}
              linkTo="/student/fees"
              extra={
                <button
                  onClick={handleQuickPay}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Pay
                </button>
              }
            />

          </div>

          {/* Main Section */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upcoming */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Upcoming Classes</h3>
                  <Link to="/student/timetable" className="text-blue-600 text-sm">
                    View all
                  </Link>
                </div>

                {upcoming.length ? (
                  upcoming.map((u, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{u.label}</p>
                        <p className="text-xs text-gray-500">{u.day}</p>
                      </div>
                      <span className="text-xs text-gray-400">Tomorrow</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No classes</p>
                )}
              </div>

              {/* Assignments */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Assignments</h3>
                  <Link to="/student/assignments" className="text-blue-600 text-sm">
                    View all
                  </Link>
                </div>

                {assignments.length ? (
                  assignments.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-xs text-gray-500">
                          {a.dueDate
                            ? new Date(a.dueDate).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">→</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No assignments</p>
                )}
              </div>

            </div>

            {/* Right */}
            <div className="space-y-6">

              <div className="bg-white p-5 rounded-2xl shadow border">
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <div className="grid gap-2">
                  <Link to="/student/attendance" className="p-2 border rounded hover:bg-gray-50">Attendance</Link>
                  <Link to="/student/results" className="p-2 border rounded hover:bg-gray-50">Results</Link>
                  <Link to="/student/timetable" className="p-2 border rounded hover:bg-gray-50">Timetable</Link>
                  <Link to="/student/library" className="p-2 border rounded hover:bg-gray-50">Library</Link>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow border">
                <h4 className="font-semibold mb-3">Notifications</h4>
                <p className="text-sm text-gray-400">No new notifications</p>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;