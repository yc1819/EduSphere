import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import toast, { Toaster } from "react-hot-toast";

import { getStudents, addStudent } from "../storage/studentsStorage";
import {
  getResults,
  addResult as addResultStorage,
  updateGrade as updateGradeStorage,
  deleteResult as deleteResultStorage,
} from "../storage/resultsStorage";

const ResultsPage = () => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [newResult, setNewResult] = useState({ roll: "", subject: "", grade: "" });
  const [sortConfig, setSortConfig] = useState({ key: "roll", direction: "asc" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let savedStudents = getStudents();
    if (!savedStudents || savedStudents.length === 0) {
      const defaultStudents = [
        { roll: "01", name: "Aarav" },
        { roll: "02", name: "Diya" },
        { roll: "03", name: "Rohan" },
      ];
      defaultStudents.forEach((s) => addStudent(s));
      savedStudents = getStudents();
    }
    setStudents(savedStudents);
    setResults(getResults());
  }, []);

  const handleNewResultChange = (e) => {
    setNewResult({ ...newResult, [e.target.name]: e.target.value });
  };

  const addResult = () => {
    if (!newResult.roll || !newResult.subject || !newResult.grade) {
      return toast.error("Fill all fields");
    }

    const student = students.find((s) => s.roll === newResult.roll);
    if (!student) return toast.error("Student not found");

    const exists = results.find(
      (r) => r.roll === newResult.roll && r.subject === newResult.subject
    );
    if (exists) return toast.error("Already exists");

    addResultStorage({ ...newResult, name: student.name });
    setResults(getResults());
    setNewResult({ roll: "", subject: "", grade: "" });
    setShowModal(false);
    toast.success("Result added");
  };

  const editGrade = (roll, subject, grade) => {
    updateGradeStorage(roll, subject, grade);
    setResults(getResults());
  };

  const deleteResult = (roll, subject) => {
    deleteResultStorage(roll, subject);
    setResults(getResults());
    toast.success("Deleted");
  };

  const filteredResults = results.filter((r) => {
    if (!r.name) return false;
    if (!search) return true;
    return r.name.toLowerCase().includes(search.toLowerCase());
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aValue = a[key];
    let bValue = b[key];

    if (key === "grade") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // 🎨 Grade Badge Color
  const getGradeColor = (grade) => {
    if (grade >= 80) return "bg-green-100 text-green-700";
    if (grade >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              Results Dashboard
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Result
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
          />

          {/* Table */}
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  {["roll", "name", "subject", "grade"].map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="p-3 cursor-pointer"
                    >
                      {col.toUpperCase()}
                    </th>
                  ))}
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedResults.map((r) => (
                  <tr key={`${r.roll}-${r.subject}`} className="border-t">

                    <td className="p-3">{r.roll}</td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">{r.subject}</td>

                    <td className="p-3">
                      <input
                        value={r.grade}
                        onChange={(e) =>
                          editGrade(r.roll, r.subject, e.target.value)
                        }
                        className={`w-16 text-center px-2 py-1 rounded ${getGradeColor(
                          Number(r.grade)
                        )}`}
                      />
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() =>
                          deleteResult(r.roll, r.subject)
                        }
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 space-y-4">

            <h2 className="text-xl font-semibold">Add Result</h2>

            <input
              name="roll"
              placeholder="Roll"
              value={newResult.roll}
              onChange={handleNewResultChange}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              name="subject"
              placeholder="Subject"
              value={newResult.subject}
              onChange={handleNewResultChange}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              name="grade"
              placeholder="Grade"
              value={newResult.grade}
              onChange={handleNewResultChange}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button
                onClick={addResult}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;