import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import {
  getTimetable,
  saveTimetable,
  updateDaySlots,
  getStaff,
  addOrUpdateStaff,
  removeStaff,
} from "../storage/timetableStorage";

const TimeTablePage = () => {
  const [timetable, setTimetable] = useState([]);
  const [staff, setStaff] = useState([]);

  const [editDay, setEditDay] = useState("");
  const [newSlots, setNewSlots] = useState([]);
  const [staffForm, setStaffForm] = useState({
    subject: "",
    name: "",
    contact: "",
  });

  useEffect(() => {
    let savedTimetable = getTimetable();

    if (savedTimetable.length === 0) {
      savedTimetable = [
        { day: "Monday", slots: ["COM", "Maths", "Eng", "", "", "", ""] },
        { day: "Tuesday", slots: ["Eng", "Eng", "Eng", "", "", "", ""] },
        { day: "Wednesday", slots: ["App", "-", "-", "", "", "", ""] },
        { day: "Thursday", slots: ["DC", "SPM", "CC", "", "", "", ""] },
        { day: "Friday", slots: ["-", "DC", "-", "", "", "", ""] },
        { day: "Saturday", slots: ["RR", "LA", "-", "", "", "", ""] },
      ];
      saveTimetable(savedTimetable);
    }

    setTimetable(savedTimetable);
    setStaff(getStaff());
  }, []);

  const handleUpdateSlots = (day) => {
    const slotsToSave = [...newSlots];
    while (slotsToSave.length < 7) slotsToSave.push("");

    updateDaySlots(day, slotsToSave);
    setTimetable(getTimetable());
    setEditDay("");
  };

  const handleAddOrUpdateStaff = () => {
    if (!staffForm.subject || !staffForm.name) {
      return alert("Fill all staff details");
    }

    addOrUpdateStaff(
      staffForm.subject,
      staffForm.name,
      staffForm.contact
    );

    setStaff(getStaff());
    setStaffForm({ subject: "", name: "", contact: "" });
  };

  const handleRemoveStaff = (subject) => {
    removeStaff(subject);
    setStaff(getStaff());
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Class Timetable
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage schedule and staff
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* TIMETABLE */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow border overflow-hidden">

              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Weekly Schedule</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="p-3 text-left">Day</th>
                      {[...Array(7)].map((_, i) => (
                        <th key={i} className="p-3 text-center">
                          P{i + 1}
                        </th>
                      ))}
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {timetable.map((row) => (
                      <tr key={row.day} className="border-t">

                        {/* Day */}
                        <td className="p-3 font-semibold text-gray-700">
                          {row.day}
                        </td>

                        {/* Slots */}
                        {row.slots.map((slot, i) => (
                          <td key={i} className="p-2 text-center">
                            {editDay === row.day ? (
                              <input
                                value={newSlots[i] || ""}
                                onChange={(e) => {
                                  const copy = [...newSlots];
                                  copy[i] = e.target.value;
                                  setNewSlots(copy);
                                }}
                                className="border rounded px-2 py-1 w-full text-center focus:ring-2 focus:ring-blue-100"
                              />
                            ) : (
                              <span className="text-gray-600">
                                {slot || "-"}
                              </span>
                            )}
                          </td>
                        ))}

                        {/* Action */}
                        <td className="p-2 text-center">
                          {editDay === row.day ? (
                            <button
                              onClick={() => handleUpdateSlots(row.day)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditDay(row.day);
                                setNewSlots([...row.slots]);
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                            >
                              Edit
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

            {/* STAFF */}
            <div className="bg-white rounded-2xl shadow border p-4 space-y-4">

              <h2 className="font-semibold text-lg">Staff Management</h2>

              {/* Staff List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {staff.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No staff added
                  </p>
                ) : (
                  staff.map((s, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border rounded-lg p-2"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {s.subject}
                        </p>
                        <p className="text-xs text-gray-500">
                          {s.name} • {s.contact}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveStaff(s.subject)}
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Form */}
              <div className="space-y-2">
                <input
                  placeholder="Subject"
                  value={staffForm.subject}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, subject: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />

                <input
                  placeholder="Staff Name"
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, name: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />

                <input
                  placeholder="Contact"
                  value={staffForm.contact}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, contact: e.target.value })
                  }
                  className="border px-3 py-2 rounded w-full text-sm"
                />

                <button
                  onClick={handleAddOrUpdateStaff}
                  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Save Staff
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTablePage;