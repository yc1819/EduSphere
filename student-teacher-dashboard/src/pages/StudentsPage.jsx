import { useEffect, useMemo, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Pencil, Trash2 } from "lucide-react";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../storage/studentsStorage";

const StudentsPage = () => {
  const [students, setStudentsState] = useState(getStudents());
  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ ONLY ADDITION HERE
  const [newStudent, setNewStudent] = useState({
    name: "",
    roll: "",
    gender: "",
    guardian: "",
    contact: "",
    parentEmail: "", // ✅ ADDED
  });

  const [columns] = useState({
    roll: true,
    name: true,
    gender: true,
    guardian: true,
    contact: true,
  });

  const [genderFilter, setGenderFilter] = useState("All");
  const [pageSize] = useState(10);
  const [rowPadding] = useState("py-3");
  const [page, setPage] = useState(1);
  const columnsRef = useRef();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const handler = (e) => {
      if (columnsRef.current && !columnsRef.current.contains(e.target)) {}
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    let list = students || [];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          (s.roll || "").toLowerCase().includes(q) ||
          (s.guardian || "").toLowerCase().includes(q) ||
          (s.contact || "").toLowerCase().includes(q)
      );
    }

    if (genderFilter !== "All") {
      list = list.filter(
        (s) =>
          (s.gender || "").toLowerCase() === genderFilter.toLowerCase()
      );
    }

    if (sortConfig.key) {
      list = [...list].sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "roll") {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = (valA || "").toString().toLowerCase();
          valB = (valB || "").toString().toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [students, query, genderFilter, sortConfig]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...newStudent, id: editId || Date.now() };

    if (editId) updateStudent(editId, payload);
    else addStudent(payload);

    setStudentsState(getStudents());
    setNewStudent({
      name: "",
      roll: "",
      gender: "",
      guardian: "",
      contact: "",
      parentEmail: "", // reset
    });
    setEditId(null);
    setOpenForm(false);
  };

  const handleEdit = (student) => {
    setNewStudent(student);
    setEditId(student.id);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this student?")) {
      deleteStudent(id);
      setStudentsState(getStudents());
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Students</h1>

            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students..."
                className="border rounded px-3 py-2 w-80"
              />
              <button
                onClick={() => setOpenForm(true)}
                className="bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
              >
                ADD STUDENT
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="border-b">
                <tr className="text-gray-600">
                  {columns.roll && (
                    <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("roll")}>
                      Roll No. {getSortIndicator("roll")}
                    </th>
                  )}
                  {columns.name && (
                    <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("name")}>
                      Name {getSortIndicator("name")}
                    </th>
                  )}
                  {columns.gender && (
                    <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort("gender")}>
                      Gender {getSortIndicator("gender")}
                    </th>
                  )}
                  {columns.guardian && <th className="px-6 py-3">Guardian</th>}
                  {columns.contact && <th className="px-6 py-3">Contact</th>}
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paged.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    {columns.roll && <td className={`px-6 ${rowPadding}`}>{s.roll}</td>}
                    {columns.name && <td className={`px-6 ${rowPadding}`}>{s.name}</td>}
                    {columns.gender && <td className={`px-6 ${rowPadding}`}>{s.gender}</td>}
                    {columns.guardian && <td className={`px-6 ${rowPadding}`}>{s.guardian}</td>}
                    {columns.contact && <td className={`px-6 ${rowPadding}`}>{s.contact}</td>}
                    <td className={`px-6 ${rowPadding} flex gap-3`}>
                      <Pencil size={18} className="text-blue-600 cursor-pointer" onClick={() => handleEdit(s)} />
                      <Trash2 size={18} className="text-red-600 cursor-pointer" onClick={() => handleDelete(s.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {openForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg">
                <h3 className="text-lg font-semibold mb-3">
                  {editId ? "Edit Student" : "Add Student"}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input required value={newStudent.roll}
                    onChange={(e)=>setNewStudent(p=>({...p,roll:e.target.value}))}
                    placeholder="Roll No." className="border px-3 py-2 rounded"/>

                  <input required value={newStudent.name}
                    onChange={(e)=>setNewStudent(p=>({...p,name:e.target.value}))}
                    placeholder="Name" className="border px-3 py-2 rounded"/>

                  <select required value={newStudent.gender}
                    onChange={(e)=>setNewStudent(p=>({...p,gender:e.target.value}))}
                    className="border px-3 py-2 rounded">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input value={newStudent.guardian}
                    onChange={(e)=>setNewStudent(p=>({...p,guardian:e.target.value}))}
                    placeholder="Guardian" className="border px-3 py-2 rounded"/>

                  <input value={newStudent.contact}
                    onChange={(e)=>setNewStudent(p=>({...p,contact:e.target.value}))}
                    placeholder="Contact" className="border px-3 py-2 rounded"/>

                  {/* ✅ ONLY NEW FIELD */}
                  <input
                    value={newStudent.parentEmail}
                    onChange={(e)=>setNewStudent(p=>({...p,parentEmail:e.target.value}))}
                    placeholder="Parent Email"
                    className="border px-3 py-2 rounded"
                  />

                  <div className="flex justify-end gap-2 mt-2">
                    <button type="button" onClick={()=>{setOpenForm(false);setEditId(null);}}
                      className="px-4 py-2 border rounded">Cancel</button>

                    <button type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded">
                      {editId ? "Update" : "Add Student"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;