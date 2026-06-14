import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { getResults } from "../storage/resultsStorage";

const StudentResults = () => {
  const roll = localStorage.getItem("student_roll");

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    if (!roll) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const allResults = getResults() || [];
    const studentResults = allResults.filter((r) => r.roll === roll);

    setResults(studentResults);
    setFilteredResults(studentResults);
  }, [roll]);

  useEffect(() => {
    if (!search) {
      setFilteredResults(results);
      return;
    }

    const filtered = results.filter((r) =>
      r.subject.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [search, results]);

  // 🎨 Grade color logic
  const getGradeStyle = (grade) => {
    const g = Number(grade);

    if (g >= 80)
      return "bg-green-100 text-green-700 border-green-200";
    if (g >= 50)
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <StudentTopbar />

        <div className="p-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              My Results
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View your subject-wise performance
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="🔍 Search subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Results Grid */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">

            {filteredResults.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-lg">No results found</p>
                <p className="text-sm">Try searching another subject</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {filteredResults.map((res, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50"
                  >
                    <div className="flex justify-between items-center">

                      {/* Subject */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                          {res.subject}
                        </h3>
                      </div>

                      {/* Grade Badge */}
                      <div
                        className={`px-3 py-1 text-sm font-semibold rounded-full border ${getGradeStyle(
                          res.grade
                        )}`}
                      >
                        {res.grade}
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentResults;