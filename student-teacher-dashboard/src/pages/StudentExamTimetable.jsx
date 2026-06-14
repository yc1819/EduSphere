import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { getExams } from "../storage/examsStorage";

const StudentExaminations = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setExams(getExams());
  }, []);

  const filteredExams = exams.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <StudentSidebar />

      <div className="flex-1 p-6">
        <StudentTopbar />

        <h1 className="text-3xl font-bold mb-6">Examinations</h1>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* EXAMS LIST */}
        {filteredExams.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No exams found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((e) => (
              <div
                key={e.id}
                className="bg-white p-5 rounded-xl shadow border hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{e.name}</h2>

                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    Exam
                  </span>
                </div>

                {/* DATE */}
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-md font-medium text-gray-800">
                    {e.date}
                  </p>
                </div>

                {/* STATUS (optional visual only) */}
                <div className="mt-4">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExaminations;