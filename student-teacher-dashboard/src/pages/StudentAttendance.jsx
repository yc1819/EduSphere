// src/pages/StudentAttendance.jsx
import { useEffect, useMemo, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { getAttendance, createInitialAttendance } from "../storage/attendanceStorage";
import { getStudents } from "../storage/studentsStorage";

const StudentAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  // Logged-in student (TEMP: use first student)
  const studentId = students.length ? String(students[0].id) : null;

  /* -------------------------
       Initial Data Setup
  -------------------------- */
  useEffect(() => {
    const allStudents = getStudents() || [];
    setStudents(allStudents);

    // Create attendance entry for today if not already created
    createInitialAttendance(today, allStudents);

    // Load all attendance data
    setAttendanceRecords(getAttendance() || []);
  }, []);

  /* -------------------------
       Attendance Percentage
  -------------------------- */
  const attendancePercent = useMemo(() => {
    if (!attendanceRecords.length || !studentId) return 0;

    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach((rec) => {
      if (rec.present.includes(studentId)) presentDays++;
      if (rec.present.includes(studentId) || rec.absent.includes(studentId)) {
        totalDays++;
      }
    });

    return totalDays ? Math.round((presentDays / totalDays) * 100) : 0;
  }, [attendanceRecords, studentId]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <StudentSidebar />
      <div className="flex-1 p-6">
        <StudentTopbar />

        <h1 className="text-3xl font-bold mb-6">My Attendance</h1>

        {/* Overview */}
        <div className="bg-white p-6 rounded-xl shadow border mb-6">
          <h2 className="text-lg font-semibold mb-2">Attendance Overview</h2>
          <p className="text-xl font-bold">{attendancePercent}% overall</p>
        </div>

        {/* Attendance Table */}
        <div className="bg-white p-6 rounded-xl shadow border overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
          <table className="w-full text-left min-w-[600px] border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length ? (
                attendanceRecords
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((rec) => {
                    if (!studentId) return null;

                    let status = "No record";
                    if (rec.present.includes(studentId)) status = "Present";
                    else if (rec.absent.includes(studentId)) status = "Absent";

                    return (
                      <tr key={rec.date} className="border-b">
                        <td className="p-2 border">{rec.date}</td>
                        <td
                          className={`p-2 border font-semibold ${
                            status === "Present"
                              ? "text-green-700"
                              : status === "Absent"
                              ? "text-red-700"
                              : "text-gray-500"
                          }`}
                        >
                          {status}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={2} className="p-2 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
