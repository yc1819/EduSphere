import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getExams as fetchExams, addExam as storeExam } from "../storage/examsStorage";

// storage helpers (UNCHANGED)
const updateExamStorage = (id, updatedFields) => {
  const exams = fetchExams();
  const updated = exams.map(e => (e.id === id ? { ...e, ...updatedFields } : e));
  localStorage.setItem("exams_data", JSON.stringify(updated));
};

const deleteExamStorage = (id) => {
  const exams = fetchExams().filter(e => e.id !== id);
  localStorage.setItem("exams_data", JSON.stringify(exams));
};

const ExaminationsPage = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [newExam, setNewExam] = useState({ name: "", date: "" });

  useEffect(() => {
    setExams(fetchExams());
  }, []);

  const handleNewExamChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  const addExam = () => {
    if (!newExam.name || !newExam.date) {
      alert("Please fill all fields");
      return;
    }

    const examWithId = { id: Date.now(), ...newExam };
    storeExam(examWithId);
    setExams([...exams, examWithId]);
    setNewExam({ name: "", date: "" });
  };

  const editExam = (id, field, value) => {
    const updated = exams.map((e) => (e.id === id ? { ...e, [field]: value } : e));
    setExams(updated);
    updateExamStorage(id, { [field]: value });
  };

  const deleteExam = (id) => {
    setExams(exams.filter((e) => e.id !== id));
    deleteExamStorage(id);
  };

  const filteredExams = exams.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Examinations</h1>

          {/* ADD EXAM CARD */}
          <div className="bg-white p-6 rounded-xl shadow border mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Exam</h2>

            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                name="name"
                placeholder="Exam Name"
                value={newExam.name}
                onChange={handleNewExamChange}
                className="border px-3 py-2 rounded w-full md:w-auto flex-1"
              />

              <input
                type="date"
                name="date"
                value={newExam.date}
                onChange={handleNewExamChange}
                className="border px-3 py-2 rounded"
              />

              <button
                onClick={addExam}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full mb-6"
          />

          {/* EXAM CARDS */}
          <div className="space-y-4">
            {filteredExams.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                No exams found
              </div>
            ) : (
              filteredExams.map((e) => (
                <div
                  key={e.id}
                  className="bg-white p-5 rounded-xl shadow border flex justify-between items-center flex-wrap gap-4"
                >
                  {/* LEFT */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={e.name}
                      onChange={(ev) =>
                        editExam(e.id, "name", ev.target.value)
                      }
                      className="text-lg font-semibold border-b focus:outline-none w-full"
                    />

                    <div className="mt-2">
                      <input
                        type="date"
                        value={e.date}
                        onChange={(ev) =>
                          editExam(e.id, "date", ev.target.value)
                        }
                        className="border px-2 py-1 rounded text-sm"
                      />
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      Exam Date
                    </span>

                    <button
                      onClick={() => deleteExam(e.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExaminationsPage;