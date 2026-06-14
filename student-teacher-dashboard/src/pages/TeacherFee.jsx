import { useEffect, useState } from "react";
import { getStudents } from "../storage/studentsStorage";
import { getAllFees } from "../storage/feeStorage";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const TeacherFee = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState({});
  const [showPendingOnly, setShowPendingOnly] =
    useState(false);

  // ✅ NEW
  const [studentPaidMonths, setStudentPaidMonths] =
    useState({});

  useEffect(() => {
    const allStudents = getStudents() || [];

    setStudents(allStudents);

    setFees(getAllFees());

    // ✅ LOAD ALL STUDENT MONTH DATA
    const paidData = {};

    allStudents.forEach((student) => {
      const savedMonths = localStorage.getItem(
        `paidMonths_${student.id}`
      );

      paidData[student.id] = savedMonths
        ? JSON.parse(savedMonths)
        : [];
    });

    setStudentPaidMonths(paidData);
  }, []);

  // ✅ GET DUE AMOUNT
  const getDue = (id) => {
    const f = fees[id];

    if (!f) return 50000;

    return f.totalAmount - f.paidAmount;
  };

  // ✅ EXPORT CSV
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Class",
      "Total Fee",
      "Paid",
      "Due",
      "Completed Months",
    ];

    const rows = [headers.join(",")];

    students.forEach((s) => {
      const fee = fees[s.id] || {
        totalAmount: 50000,
        paidAmount: 0,
      };

      const due =
        fee.totalAmount - fee.paidAmount;

      const completedMonths =
        studentPaidMonths[s.id]?.join(" | ") ||
        "None";

      rows.push(
        `${s.name},${
          s.className || s.course || ""
        },${fee.totalAmount},${
          fee.paidAmount
        },${due},${completedMonths}`
      );
    });

    const blob = new Blob(
      [rows.join("\n")],
      {
        type: "text/csv",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "student_fee_report.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  // ✅ STATS
  const totalStudents =
    students.length;

  const pendingStudents =
    students.filter(
      (s) => getDue(s.id) > 0
    ).length;

  const paidStudents =
    totalStudents -
    pendingStudents;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">

            <h1 className="text-3xl font-semibold text-gray-800">
              Fee Management
            </h1>

            <button
              onClick={handleExportCSV}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Export CSV
            </button>

          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white p-5 rounded-xl shadow border">

              <p className="text-sm text-gray-500">
                Total Students
              </p>

              <h2 className="text-2xl font-semibold">
                {totalStudents}
              </h2>

            </div>

            <div className="bg-white p-5 rounded-xl shadow border">

              <p className="text-sm text-gray-500">
                Paid Students
              </p>

              <h2 className="text-2xl font-semibold text-green-600">
                {paidStudents}
              </h2>

            </div>

            <div className="bg-white p-5 rounded-xl shadow border">

              <p className="text-sm text-gray-500">
                Pending Students
              </p>

              <h2 className="text-2xl font-semibold text-red-600">
                {pendingStudents}
              </h2>

            </div>

          </div>

          {/* FILTER */}
          <div className="flex items-center justify-between">

            <label className="flex items-center cursor-pointer gap-3">

              <div
                onClick={() =>
                  setShowPendingOnly(
                    !showPendingOnly
                  )
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  showPendingOnly
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >

                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                    showPendingOnly
                      ? "translate-x-6"
                      : ""
                  }`}
                />

              </div>

              <span className="text-gray-700 font-medium">
                Show Pending Only
              </span>

            </label>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">

                  <tr>
                    <th className="p-4 text-left">
                      Name
                    </th>

                    

                    <th className="p-4 text-left">
                      Total
                    </th>

                    <th className="p-4 text-left">
                      Paid
                    </th>

                    <th className="p-4 text-left">
                      Due
                    </th>

                    <th className="p-4 text-left">
                      Completed Months
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {students
                    .filter((s) => {
                      const due =
                        getDue(s.id);

                      return showPendingOnly
                        ? due > 0
                        : true;
                    })
                    .map((s) => {

                      const fee =
                        fees[s.id] || {
                          totalAmount: 50000,
                          paidAmount: 0,
                        };

                      const due =
                        fee.totalAmount -
                        fee.paidAmount;

                      const completedMonths =
                        studentPaidMonths[
                          s.id
                        ] || [];

                      return (
                        <tr
                          key={s.id}
                          className="border-t hover:bg-gray-50 transition"
                        >

                          <td className="p-4 font-medium text-gray-700">
                            {s.name}
                          </td>

                          

                          <td className="p-4">
                            ₹{fee.totalAmount}
                          </td>

                          <td className="p-4 text-green-600 font-medium">
                            ₹{fee.paidAmount}
                          </td>

                          <td
                            className={`p-4 font-semibold ${
                              due > 0
                                ? "text-red-600"
                                : "text-green-700"
                            }`}
                          >
                            ₹{due}
                          </td>

                          {/* COMPLETED MONTHS */}
                          <td className="p-4">

                            {completedMonths.length >
                            0 ? (
                              <div className="flex flex-wrap gap-1">

                                {completedMonths.map(
                                  (
                                    month,
                                    index
                                  ) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                                    >
                                      {month}
                                    </span>
                                  )
                                )}

                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                No Months Paid
                              </span>
                            )}

                          </td>

                          {/* STATUS */}
                          <td className="p-4">

                            <span
                              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                due > 0
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {due > 0
                                ? "Pending"
                                : "Paid"}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  {students.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-10 text-gray-400"
                      >
                        No students found
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
};

export default TeacherFee;