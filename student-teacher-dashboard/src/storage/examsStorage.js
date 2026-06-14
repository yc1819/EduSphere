const STORAGE_KEY = "exams_data";

export const getExams = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

export const addExam = (exam) => {
  const data = getExams();
  data.push({ id: Date.now(), ...exam });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
