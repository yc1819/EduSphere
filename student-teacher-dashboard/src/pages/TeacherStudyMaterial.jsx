import { useState, useEffect } from "react";
import {
  getAllMaterials,
  addMaterial,
  deleteMaterial,
} from "../storage/studyMaterialStorage";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const TeacherStudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMaterials(getAllMaterials());
  }, []);

  const handleUpload = () => {
    if (!title || !file) return alert("Title and file are required");

    const reader = new FileReader();
    reader.onload = () => {
      addMaterial({
        title,
        description,
        fileName: file.name,
        fileData: reader.result,
      });

      setMaterials(getAllMaterials());
      setTitle("");
      setDescription("");
      setFile(null);
    };

    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    deleteMaterial(id);
    setMaterials(getAllMaterials());
  };

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
      <Sidebar />

      <div className="flex-1">
        <Topbar />

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

          {/* UPLOAD */}
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg border space-y-3">
            <h2 className="text-xl font-semibold">Upload Notes</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded-lg w-full"
            />

            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Upload
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />

          {/* MATERIAL LIST */}
          {filteredMaterials.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No materials found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-5 rounded-2xl shadow border"
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

                  {/* ✅ FIXED PREVIEW */}
                  {m.fileData && (
                    <div className="mt-3">

                      {/* IMAGE PREVIEW */}
                      {isImage(m.fileName) && (
                        <img
                          src={m.fileData}
                          alt="preview"
                          className="w-full h-40 object-cover rounded"
                        />
                      )}

                      {/* PDF ICON + BUTTON */}
                      {isPDF(m.fileName) && (
                        <div className="text-center text-gray-500 text-sm">
                          📄 PDF File
                        </div>
                      )}

                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-4 flex justify-between">

                    <a
                      href={m.fileData}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-sm"
                    >
                      View
                    </a>

                    <a
                      href={m.fileData}
                      download={m.fileName}
                      className="text-green-600 text-sm"
                    >
                      Download
                    </a>

                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherStudyMaterial;