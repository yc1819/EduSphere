import { useState, useEffect } from "react";
import { getAllMaterials } from "../storage/studyMaterialStorage";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";

const StudentStudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setMaterials(getAllMaterials());
  }, []);

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const getFileType = (name) => {
    if (name.endsWith(".pdf")) return "PDF";
    if (name.match(/\.(jpg|png|jpeg)$/)) return "Image";
    if (name.match(/\.(doc|docx)$/)) return "Doc";
    return "File";
  };

  const isImage = (name) => name.match(/\.(jpg|png|jpeg)$/);
  const isPDF = (name) => name.endsWith(".pdf");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <StudentSidebar />

      <div className="flex-1">
        <StudentTopbar />

        <main className="p-8 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Study Materials
            </h1>

            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm">
              {materials.length} Files
            </span>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />

          {/* LIST */}
          {filteredMaterials.length === 0 ? (
            <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow text-center text-gray-500">
              No study materials found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/80 backdrop-blur p-5 rounded-2xl shadow border hover:shadow-xl transition"
                >
                  <h2 className="text-lg font-semibold">{m.title}</h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {m.description}
                  </p>

                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                      {getFileType(m.fileName)}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400 truncate w-[120px]">
                      {m.fileName}
                    </span>

                    <div className="flex gap-3">
                      {/* VIEW */}
                      <button
                        onClick={() => setSelectedFile(m)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View
                      </button>

                      {/* DOWNLOAD */}
                      <a
                        href={m.fileData}
                        download={m.fileName}
                        className="text-green-600 text-sm hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 🔥 MODAL VIEWER */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded-2xl flex flex-col shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">{selectedFile.title}</h2>

              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* FILE VIEW */}
            <div className="flex-1 flex items-center justify-center">

              {/* IMAGE PREVIEW */}
              {isImage(selectedFile.fileName) && (
                <img
                  src={selectedFile.fileData}
                  alt="preview"
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* PDF FIX (NO IFRAME) */}
              {isPDF(selectedFile.fileName) && (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">📄 PDF Preview</p>

                  <a
                    href={selectedFile.fileData}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Open PDF
                  </a>
                </div>
              )}

              {/* OTHER FILE */}
              {!isImage(selectedFile.fileName) && !isPDF(selectedFile.fileName) && (
                <div className="text-gray-500">
                  Preview not supported
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentStudyMaterial;