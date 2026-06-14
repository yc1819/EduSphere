// src/storage/feeStorage.js

const FEE_KEY = "student_fees";

/* -------------------------------
   Get all students' fee records
-------------------------------- */
export const getAllFees = () => {
  const data = localStorage.getItem(FEE_KEY);
  return data ? JSON.parse(data) : {};
};

/* -------------------------------
   Get one student's fee record
-------------------------------- */
export const getStudentFee = (studentId) => {
  const all = getAllFees();

  if (!all[studentId]) {
    all[studentId] = {
      totalAmount: 50000, // default total fee
      paidAmount: 0,
      history: [],
    };
    localStorage.setItem(FEE_KEY, JSON.stringify(all));
  }

  return all[studentId];
};

/* -------------------------------
   Add a payment (Teacher or Student)
-------------------------------- */
export const addPayment = (studentId, amount) => {
  const all = getAllFees();

  if (!all[studentId]) {
    all[studentId] = {
      totalAmount: 50000,
      paidAmount: 0,
      history: [],
    };
  }

  const fee = all[studentId];
  const pending = fee.totalAmount - fee.paidAmount;
  const pay = Math.min(amount, pending);

  if (pay <= 0) return;

  fee.paidAmount += pay;
  fee.history.push({
    id: Date.now(),
    amount: pay,
    date: new Date().toISOString(),
  });

  all[studentId] = fee;
  localStorage.setItem(FEE_KEY, JSON.stringify(all));
};

/* -------------------------------
   Delete a payment
-------------------------------- */
export const deletePayment = (studentId, paymentId) => {
  const all = getAllFees();
  if (!all[studentId]) return;

  const fee = all[studentId];
  const payment = fee.history.find((p) => p.id === paymentId);
  if (!payment) return;

  fee.paidAmount -= payment.amount;
  fee.history = fee.history.filter((p) => p.id !== paymentId);

  all[studentId] = fee;
  localStorage.setItem(FEE_KEY, JSON.stringify(all));
};

/* -------------------------------
   Alias for StudentPayment component
-------------------------------- */
export const payFee = addPayment;
