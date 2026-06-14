import { useMemo } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AttendanceChart from "../components/AttendanceChart";
import AbsenteesCard from "../components/AbsenteesCard";
import { useAttendance } from "../hooks/useAttendance";
import {
  ClipboardList,
  FileText,
  CheckCircle,
  BookOpen,
  Calendar,
  Plus,
  ArrowRight,
  Bell,
} from "lucide-react";

import { getAttendance } from "../storage/attendanceStorage";
import { getTimetable } from "../storage/timetableStorage";
import { getStudents } from "../storage/studentsStorage";
import { getAssignments } from "../storage/assignmentsStorage";

const formatToday = () => new Date().toISOString().split("T")[0];

const StatTile = ({ icon, title, value, subtitle }) => (
  <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default function TeacherDashboard() {
  const students = Array.isArray(getStudents()) ? getStudents() : [];
  const assignments = Array.isArray(getAssignments()) ? getAssignments() : [];
  const timetable =
    Array.isArray(getTimetable()) && getTimetable().length
      ? getTimetable()
      : [
          { id: 1, subject: "Mathematics", teacher: "Mrs. Chawla", time: "09:00 AM" },
          { id: 2, subject: "English", teacher: "Mr. Singh", time: "10:00 AM" },
          { id: 3, subject: "Science", teacher: "Dr. Verma", time: "11:00 AM" },
        ];

  const attendanceRecords = Array.isArray(getAttendance()) ? getAttendance() : [];

  const absenteesToday = useMemo(() => {
  const today = formatToday();

  // ✅ Find today's attendance
  const rec = attendanceRecords.find(
    (r) => r.date === today
  );

  // No attendance yet
  if (!rec || !Array.isArray(rec.present)) {
    return [];
  }

  // ✅ Convert all present IDs to string
  const presentIds = rec.present.map((id) =>
    String(id)
  );

  // ✅ Students not in present list = absent
  return students.filter(
    (student) =>
      !presentIds.includes(String(student.id))
  );
}, [attendanceRecords, students]);

  const todaysAbsenteesCount = absenteesToday.length;

  const attendancePercent = useMemo(() => {
    if (!attendanceRecords.length) return 92;

    const unique = [
      ...new Map(attendanceRecords.map((r) => [r.date, r])).values(),
    ].slice(-7);

    const total = unique.reduce(
      (sum, x) => sum + (x.presentPercentage || 0),
      0
    );

    return Math.round(total / unique.length) || 92;
  }, [attendanceRecords]);

  const totalStudents = students.length;
  const totalAssignments = assignments.length;
  const nextClasses = timetable.slice(0, 3);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Teacher Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Class Overview
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-xl shadow flex items-center gap-2">
                <Bell size={16} />
                <span className="text-sm text-gray-600">
                  {todaysAbsenteesCount} absentees
                </span>
              </div>

              <Link
                to="/timetable"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
              >
                <Calendar size={16} /> Timetable
              </Link>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatTile
              icon={<ClipboardList size={18} />}
              title="Students"
              value={totalStudents}
              subtitle="Total enrolled"
            />
            <StatTile
              icon={<CheckCircle size={18} />}
              title="Attendance"
              value={`${attendancePercent}%`}
              subtitle="Last 7 days"
            />
            <StatTile
              icon={<FileText size={18} />}
              title="Assignments"
              value={totalAssignments}
              subtitle="Active"
            />
            <StatTile
              icon={<BookOpen size={18} />}
              title="Library"
              value="Active"
              subtitle="Status"
            />
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {/* ATTENDANCE */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Attendance Overview</h3>
                  <span className="text-sm text-gray-500">
                    {attendancePercent}% avg
                  </span>
                </div>

                <AttendanceChart />

                <div className="mt-4 flex gap-3">
                  <Link to="/attendance" className="border px-3 py-2 rounded">
                    Open
                  </Link>
                  <Link
                    to="/attendance"
                    className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
                  >
                    <Plus size={14} /> Mark
                  </Link>
                </div>
              </div>

              {/* ACTIVITY */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <Link to="/assignments" className="text-blue-600 text-sm">
                    Manage
                  </Link>
                </div>

                {(assignments.length
                  ? assignments.slice(0, 4)
                  : [
                      { id: 1, title: "Math Project" },
                      { id: 2, title: "English Essay" },
                    ]
                ).map((a) => (
                  <div key={a.id} className="flex justify-between border-b py-2">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-gray-500">
                        {a.date
                          ? new Date(a.date).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">→</span>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* ABSENTEES */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Absentees</h3>
                  <span className="text-sm text-gray-500">
                    {todaysAbsenteesCount}
                  </span>
                </div>

                <AbsenteesCard
  absentees={absenteesToday}
/>
              </div>

              {/* CLASSES */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold">Upcoming</h3>
                  <Link to="/timetable" className="text-blue-600 text-sm">
                    View
                  </Link>
                </div>

                {nextClasses.map((cls) => (
                  <div key={cls.id} className="flex justify-between border-b py-2">
                    <div>
                      <p className="font-medium">{cls.subject}</p>
                      <p className="text-xs text-gray-500">{cls.teacher}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {cls.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-white p-5 rounded-2xl shadow border">
                <h3 className="font-semibold mb-3">Quick Actions</h3>

                <div className="space-y-2">
                  <Link to="/assignments" className="flex justify-between p-2 border rounded hover:bg-gray-50">
                    <span className="flex gap-2 items-center">
                      <Plus size={14} /> New Assignment
                    </span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link to="/attendance" className="flex justify-between p-2 border rounded hover:bg-gray-50">
                    <span className="flex gap-2 items-center">
                      <Calendar size={14} /> Mark Attendance
                    </span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link to="/students" className="flex justify-between p-2 border rounded hover:bg-gray-50">
                    <span className="flex gap-2 items-center">
                      <ClipboardList size={14} /> Students
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}