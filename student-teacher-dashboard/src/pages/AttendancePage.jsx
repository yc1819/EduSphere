import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AbsenteesCard from "../components/AbsenteesCard";
import { useAttendance } from "../hooks/useAttendance";
import toast, { Toaster } from "react-hot-toast";

import emailjs from "@emailjs/browser";
import { useEffect } from "react";

const AttendancePage = () => {
  const today = new Date().toISOString().split("T")[0];

  const { students, present, toggle, markAllPresent, markAllAbsent } = useAttendance();

  useEffect(() => {
    emailjs.init("8sxz1OJRSh1ez11sx");
  }, []);

  if (!students || !students.length) return null;

  const sendAbsentEmail = async (student) => {
    try {
      await emailjs.send(
        "service_rz0j3cr",
        "template_vhzbtof",
        {
          name: student.name,
          roll: student.roll,
          parentEmail: student.parentEmail,
          date: today,
        }
      );

      console.log("Email sent to parent");
    } catch (error) {
      console.log("Email error:", error);
    }
  };

  const exportAttendance = () => {
    const header = ["Roll", "Name", "Course", "Status"];
    const rows = students.map((s) => [
      s.roll,
      s.name,
      s.course || "",
      present[s.id] ? "Present" : "Absent",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `attendance_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggle = (id) => {
    const student = students.find((s) => s.id === id);
    const wasPresent = present[id];

    toggle(id);

    if (wasPresent && student?.parentEmail) {
      sendAbsentEmail(student);
      toast.error(`${student.name} marked absent. Parent notified 📧`);
    }
  };

  const handleMarkAllPresent = () => {
    markAllPresent();
    toast.success("All students marked present");
  };

  const handleMarkAllAbsent = () => {
    markAllAbsent();

    students.forEach((student) => {
      if (student.parentEmail) {
        sendAbsentEmail(student);
      }
    });

    toast.success("All students marked absent");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8 space-y-6">

          <Toaster position="top-right" reverseOrder={false} />

          {/* HEADER */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Take Attendance
          </h1>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 flex-wrap">

            <button
              onClick={handleMarkAllPresent}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Mark All Present
            </button>

            <button
              onClick={handleMarkAllAbsent}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Mark All Absent
            </button>

            <button
              onClick={exportAttendance}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Export Attendance
            </button>

          </div>

          {/* ABSENTEES CARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-lg border">
              <AbsenteesCard students={students} present={present} />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg border overflow-x-auto">

            <table className="w-full text-left min-w-[600px] text-sm">

              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">Roll</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{s.roll}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">{s.course || ""}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggle(s.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                          present[s.id]
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {present[s.id] ? "Present" : "Absent"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AttendancePage;