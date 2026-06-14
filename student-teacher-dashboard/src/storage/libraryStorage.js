const STORAGE_KEY = "book_requests";

// ✅ Safe fetch
export const getBookRequests = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

// ✅ Add request (no duplicate)
export const addBookRequest = (request) => {
  const requests = getBookRequests();

  const exists = requests.find(
    (r) =>
      r.bookId === request.bookId &&
      r.student === request.student
  );

  if (exists) return; // prevent duplicate

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...requests, request])
  );
};

// ✅ Update request status
export const updateBookRequest = (id, status) => {
  const updated = getBookRequests().map((r) =>
    r.id === id ? { ...r, status } : r
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// ✅ NEW: Get requests for a specific student
export const getStudentRequests = (studentName) => {
  return getBookRequests().filter(
    (r) => r.student === studentName
  );
};

// ✅ NEW: Clear all requests (optional admin use)
export const clearAllRequests = () => {
  localStorage.removeItem(STORAGE_KEY);
};