// src/context/AttendanceContext.jsx
import { createContext, useEffect, useState } from "react";
import { getStudents } from "../storage/studentsStorage";
import {
  getTodayAttendance,
  saveDailyAttendance,
  createInitialAttendance,
} from "../storage/attendanceStorage";

export const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const today = new Date().toISOString().split("T")[0];

  const [students, setStudents] = useState([]);
  const [present, setPresent] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load students + today’s record
  useEffect(() => {
    const allStudents = getStudents();
    setStudents(allStudents);

    let saved = getTodayAttendance(today);
    if (!saved) {
      saved = createInitialAttendance(today, allStudents);
    }

    const map = {};
    allStudents.forEach((s) => {
      map[String(s.id)] = saved.present.includes(String(s.id));
    });

    setPresent(map);
    setIsLoaded(true);
  }, [today]);

  // SAVE attendance whenever present changes
  useEffect(() => {
    if (!isLoaded || students.length === 0) return;

    const presentIds = students
      .map((s) => String(s.id))
      .filter((id) => present[id]);

    saveDailyAttendance(today, { present: presentIds }, students);
  }, [present, students, isLoaded, today]);

  // Compute ABSENTEES (very important fix)
  const absentees = students.filter((s) => !present[String(s.id)]);

  // Toggle one student
  const toggle = (id) => {
    const sid = String(id);
    setPresent((prev) => ({ ...prev, [sid]: !prev[sid] }));
  };

  // Mark all present
  const markAllPresent = () => {
    const all = {};
    students.forEach((s) => (all[String(s.id)] = true));
    setPresent(all);
  };

  // Mark all absent
  const markAllAbsent = () => {
    const all = {};
    students.forEach((s) => (all[String(s.id)] = false));
    setPresent(all);
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        present,
        absentees, // ← FIXED
        toggle,
        markAllPresent,
        markAllAbsent,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}
