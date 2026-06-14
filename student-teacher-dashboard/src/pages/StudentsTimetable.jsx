import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { getTimetable } from "../storage/timetableStorage";

const StudentsTimetable = () => {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    let savedTimetable = getTimetable();

    if (!savedTimetable || savedTimetable.length === 0) {
      savedTimetable = [
        { day: "Monday", slots: ["COM (Room 5)", "Maths", "English", "", "", "", ""] },
        { day: "Tuesday", slots: ["English", "English", "English", "", "", "", ""] },
        { day: "Wednesday", slots: ["App", "-", "-", "", "", "", ""] },
        { day: "Thursday", slots: ["DC", "SPM", "CC", "", "", "", ""] },
        { day: "Friday", slots: ["-", "DC", "-", "", "", "", ""] },
        { day: "Saturday", slots: ["RR", "LA", "-", "", "", "", ""] },
      ];
    }

    setTimetable(savedTimetable);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <StudentTopbar />

        <div className="p-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              My Timetable
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Weekly class schedule overview
            </p>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* Header */}
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="p-3 text-left">Day</th>
                    {[...Array(7)].map((_, i) => (
                      <th key={i} className="p-3 text-center">
                        Period {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {timetable.map((row) => (
                    <tr key={row.day} className="border-t">

                      {/* Day */}
                      <td className="p-3 font-semibold text-gray-700 bg-gray-50">
                        {row.day}
                      </td>

                      {/* Slots */}
                      {row.slots.map((slot, i) => (
                        <td key={i} className="p-2">
                          <div
                            className={`text-center px-2 py-2 rounded-md text-xs font-medium
                              ${
                                slot && slot !== "-"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            {slot && slot !== "-" ? slot : "—"}
                          </div>
                        </td>
                      ))}

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentsTimetable;