const RESULTS_KEY = "results";

// Fetch all results
export const getResults = () => {
  const data = localStorage.getItem(RESULTS_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save all results
export const saveResults = (results) => {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
};

// Add a new result
export const addResult = (result) => {
  const results = getResults();
  results.push(result);
  saveResults(results);
};

// Update grade for a specific roll + subject
export const updateGrade = (roll, subject, grade) => {
  const results = getResults();
  const updated = results.map((r) =>
    r.roll === roll && r.subject === subject ? { ...r, grade } : r
  );
  saveResults(updated);
};

// Delete result by roll + subject
export const deleteResult = (roll, subject) => {
  const updated = getResults().filter((r) => !(r.roll === roll && r.subject === subject));
  saveResults(updated);
};

