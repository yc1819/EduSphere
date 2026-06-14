// src/hooks/useAttendance.js
import { useContext } from "react";
import { AttendanceContext } from "../context/AttendanceContext";

export function useAttendance() {
  return useContext(AttendanceContext);
}
