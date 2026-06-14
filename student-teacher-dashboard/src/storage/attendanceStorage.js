// KEY FOR STORAGE
const KEY = "attendance_records";

// Get today's date "YYYY-MM-DD"
export const formatToday = () => new Date().toISOString().split("T")[0];

// Fetch all attendance records (always returns an array)
export const getAttendance = () => {
  const data = localStorage.getItem(KEY);
  try {
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Save all records to storage
export const saveAttendance = (records) => {
  if (Array.isArray(records)) {
    localStorage.setItem(KEY, JSON.stringify(records));
  }
};

// Create record for a day only once
export const createInitialAttendance = (date, students) => {
  const records = getAttendance();

  // If record exists, return it
  const existing = records.find((r) => r.date === date);
  if (existing) return existing;

  const absentIds = students.map((s) => String(s.id));

  const newRecord = {
    date,
    present: [],
    absent: absentIds,
    presentPercentage: 0,
  };

  records.push(newRecord);
  saveAttendance(records);

  return newRecord;
};

// Save attendance for the day
export const saveDailyAttendance = (date, data, students = []) => {
  const records = getAttendance();

  // Convert IDs to strings
  const present = (data.present || []).map(String);

  const absent = students
    .map((s) => String(s.id))
    .filter((id) => !present.includes(id));

  const total = present.length + absent.length;

  const percentage = total > 0 ? Math.round((present.length / total) * 100) : 0;

  const updatedRecord = {
    date,
    present,
    absent,
    presentPercentage: percentage,
  };

  const index = records.findIndex((r) => r.date === date);

  if (index >= 0) {
    records[index] = updatedRecord; // update
  } else {
    records.push(updatedRecord); // new insert
  }

  saveAttendance(records);
};

// Get attendance for any date (defaults to today)
export const getTodayAttendance = (date = formatToday()) => {
  const records = getAttendance();
  return records.find((r) => r.date === date) || null;
};
