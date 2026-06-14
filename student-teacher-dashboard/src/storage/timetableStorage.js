const TIMETABLE_KEY = "timetable";
const STAFF_KEY = "staff";

/* ================= TIMETABLE ================= */

// Fetch timetable
export const getTimetable = () => {
  const data = localStorage.getItem(TIMETABLE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save timetable
export const saveTimetable = (timetable) => {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(timetable));
};

// Update a day's slots
export const updateDaySlots = (day, slots) => {
  const timetable = getTimetable();
  const updated = timetable.map((d) =>
    d.day === day ? { ...d, slots } : d
  );
  saveTimetable(updated);
};

/* ================= STAFF ================= */

// Fetch staff
export const getStaff = () => {
  const data = localStorage.getItem(STAFF_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save staff
export const saveStaff = (staff) => {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
};

// Add or update staff member
export const addOrUpdateStaff = (subject, name, contact) => {
  const staff = getStaff();
  const index = staff.findIndex((s) => s.subject === subject);
  if (index >= 0) {
    staff[index] = { subject, name, contact }; // update existing
  } else {
    staff.push({ subject, name, contact }); // add new
  }
  saveStaff(staff);
};

// Remove staff member by subject
export const removeStaff = (subject) => {
  const staff = getStaff().filter((s) => s.subject !== subject);
  saveStaff(staff);
};
