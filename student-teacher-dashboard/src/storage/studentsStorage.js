// src/storage/studentsStorage.js

// KEY for localStorage
const STORAGE_KEY = "students_data";

/* -----------------------------
   GET ALL STUDENTS
------------------------------ */
export const getAllStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/* -----------------------------
   GET STUDENTS (alias)
   For backward compatibility
------------------------------ */
export const getStudents = getAllStudents;

/* -----------------------------
   ADD STUDENT
------------------------------ */
export const addStudent = (student) => {
  const students = getAllStudents();
  students.push({ id: Date.now(), ...student });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

/* -----------------------------
   UPDATE STUDENT
------------------------------ */
export const updateStudent = (id, updatedData) => {
  let students = getAllStudents();
  students = students.map((s) =>
    String(s.id) === String(id) ? { ...s, ...updatedData } : s
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

/* -----------------------------
   DELETE STUDENT
------------------------------ */
export const deleteStudent = (id) => {
  let students = getAllStudents();
  students = students.filter((s) => String(s.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};
