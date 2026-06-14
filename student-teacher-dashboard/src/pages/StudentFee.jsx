import { useState, useEffect } from "react";
import { getStudentFee, payFee, deletePayment } from "../storage/feeStorage";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { getStudents } from "../storage/studentsStorage";
import { CheckCircle, XCircle } from "lucide-react";
import jsPDF from "jspdf";

const banks = [
  "HDFC Bank",
  "ICICI Bank",
  "SBI",
  "Axis Bank",
  "Kotak Mahindra",
];

const StudentFee = () => {
  const [student, setStudent] = useState(null);

  const [fee, setFee] = useState({
    totalAmount: 0,
    paidAmount: 0,
    history: [],
  });

  const [paymentAmount, setPaymentAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [bank, setBank] = useState(banks[0]);
  const [upi, setUpi] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ✅ MONTH SELECTION
  const [selectedMonths, setSelectedMonths] = useState([]);

  // ✅ STUDENT-WISE PAID MONTHS
  const [paidMonths, setPaidMonths] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(null);

  // ✅ LOAD CURRENT STUDENT
  useEffect(() => {
    const storedId = localStorage.getItem("currentStudentId");

    const students = getStudents() || [];

    const currentStudent = students.find(
      (s) =>
        String(s.id) === String(storedId) ||
        String(s.roll) === String(storedId)
    );

    setStudent(currentStudent || null);

    if (currentStudent) {
      setFee(getStudentFee(currentStudent.id));
    }
  }, []);

  // ✅ LOAD STUDENT-WISE COMPLETED MONTHS
  useEffect(() => {
    if (student?.id) {
      const savedMonths = localStorage.getItem(
        `paidMonths_${student.id}`
      );

      setPaidMonths(
        savedMonths ? JSON.parse(savedMonths) : []
      );
    }
  }, [student]);

  if (!student) {
    return <p className="p-8">No student selected.</p>;
  }

  const pendingAmount = fee.totalAmount - fee.paidAmount;

  const progress =
    fee.totalAmount > 0
      ? (fee.paidAmount / fee.totalAmount) * 100
      : 0;

  // ✅ MONTHLY FEES
  const monthlyFees = [
    {
      month: "January",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "February",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "March",
      tuition: 4000,
      lab: 700,
      library: 300,
      total: 5000,
    },
    {
      month: "April",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "May",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "June",
      tuition: 4000,
      lab: 1000,
      library: 300,
      total: 5300,
    },
    {
      month: "July",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "August",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "September",
      tuition: 4000,
      lab: 700,
      library: 300,
      total: 5000,
    },
    {
      month: "October",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "November",
      tuition: 4000,
      lab: 500,
      library: 300,
      total: 4800,
    },
    {
      month: "December",
      tuition: 4000,
      lab: 1200,
      library: 300,
      total: 5500,
    },
  ];

  // ✅ HANDLE MONTH CHECKBOX
  const handleMonthSelect = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month]
    );
  };

  // ✅ OPEN PAYMENT MODAL
  const openMonthlyPayment = (amount, month) => {
    setPaymentAmount(amount);
    setCurrentMonth(month);
    setShowModal(true);
    setPaymentStatus(null);
  };

  // ✅ GENERATE PDF RECEIPT
  const generateReceipt = (student, payment) => {
    const doc = new jsPDF();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("EduSphere", 15, 16);

    doc.setFontSize(10);
    doc.text("Smart Learning Platform", 140, 16);

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(15);
    doc.text("FEE PAYMENT RECEIPT", 60, 40);

    doc.line(15, 45, 195, 45);

    doc.setFontSize(12);
    doc.text("Student Details", 15, 60);

    doc.rect(15, 65, 180, 35);

    doc.setFontSize(11);
    doc.text(`Name: ${student.name}`, 20, 75);
    doc.text(`Roll No: ${student.roll}`, 20, 85);
    doc.text(`Course: ${student.course}`, 20, 95);

    doc.setFontSize(12);
    doc.text("Payment Details", 15, 115);

    doc.rect(15, 120, 180, 35);

    doc.setFontSize(11);
    doc.text(`Amount Paid: ₹${payment.amount}`, 20, 130);
    doc.text(`Date: ${payment.date}`, 20, 140);
    doc.text(`Payment ID: ${payment.id}`, 20, 150);

    doc.setFillColor(34, 197, 94);
    doc.rect(140, 130, 40, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("SUCCESS", 150, 137);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("This is a system generated receipt.", 15, 180);
    doc.text("No signature required.", 15, 186);

    doc.setFontSize(11);
    doc.text("Thank you for using EduSphere!", 120, 195);

    doc.save(
      `EduSphere_Receipt_${student.roll}_${payment.id}.pdf`
    );
  };

  // ✅ PAYMENT SIMULATION
  const simulatePayment = () => {
    setProcessing(true);
    setPaymentStatus(null);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        // ✅ SAVE PAYMENT
        payFee(student.id, Number(paymentAmount));

        setFee(getStudentFee(student.id));

        setPaymentStatus("success");

        // ✅ MARK MONTH COMPLETED FOR CURRENT STUDENT ONLY
        if (currentMonth) {
          const updatedMonths = [
            ...paidMonths,
            currentMonth,
          ];

          setPaidMonths(updatedMonths);

          localStorage.setItem(
            `paidMonths_${student.id}`,
            JSON.stringify(updatedMonths)
          );
        }

        alert(
          `EduSphere Notification:\n\nPayment of ₹${paymentAmount} has been successfully received.\n\nA receipt can be downloaded from payment history.\n\n- EduSphere Team`
        );
      } else {
        setPaymentStatus("fail");
      }

      setProcessing(false);
    }, 2000);
  };

  // ✅ CONFIRM PAYMENT
  const handleConfirmPayment = () => {
    if (
      paymentMethod === "card" &&
      cardNumber.length !== 16
    )
      return;

    if (
      paymentMethod === "netbanking" &&
      !bank
    )
      return;

    if (paymentMethod === "upi" && !upi)
      return;

    simulatePayment();
  };

  // ✅ DELETE PAYMENT
  const handleDelete = (id) => {
    deletePayment(student.id, id);

    setFee(getStudentFee(student.id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <StudentTopbar />

        <main className="p-6 space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Fee Payment
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage your fee and payments
            </p>
          </div>

          {/* STUDENT INFO */}
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-3">
              Student Info
            </h2>

            <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {student.name}
              </p>

              <p>
                <strong>Roll:</strong> {student.roll}
              </p>

              
            </div>
          </div>

          {/* FEE OVERVIEW */}
          <div className="bg-white p-5 rounded-xl shadow border space-y-4">

            <h2 className="text-lg font-semibold">
              Fee Overview
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center">

              <div>
                <p className="text-gray-500 text-sm">
                  Total
                </p>

                <p className="font-semibold">
                  ₹{fee.totalAmount}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Paid
                </p>

                <p className="font-semibold text-green-600">
                  ₹{fee.paidAmount}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Pending
                </p>

                <p className="font-semibold text-red-600">
                  ₹{pendingAmount}
                </p>
              </div>

            </div>

            <div>
              <div className="h-2 bg-gray-200 rounded-full">

                <div
                  className="h-2 bg-blue-600 rounded-full transition"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <p className="text-xs text-gray-500 mt-1">
                {progress.toFixed(0)}% paid
              </p>
            </div>

          </div>

          {/* MONTHLY FEES */}
          <div className="bg-white p-5 rounded-xl shadow border">

            <h2 className="text-lg font-semibold mb-4">
              Monthly Fee Structure
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">
                      Select
                    </th>

                    <th className="p-3 text-left">
                      Month
                    </th>

                    <th className="p-3 text-left">
                      Tuition Fee
                    </th>

                    <th className="p-3 text-left">
                      Lab Charges
                    </th>

                    <th className="p-3 text-left">
                      Library Charges
                    </th>

                    <th className="p-3 text-left">
                      Total
                    </th>

                    <th className="p-3 text-left">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {monthlyFees.map((item, index) => {

                    const isSelected =
                      selectedMonths.includes(
                        item.month
                      );

                    const isPaid =
                      paidMonths.includes(
                        item.month
                      );

                    return (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={
                              isSelected || isPaid
                            }
                            disabled={isPaid}
                            onChange={() =>
                              handleMonthSelect(
                                item.month
                              )
                            }
                            className="w-4 h-4"
                          />
                        </td>

                        <td className="p-3">
                          {item.month}
                        </td>

                        <td className="p-3">
                          ₹{item.tuition}
                        </td>

                        <td className="p-3">
                          ₹{item.lab}
                        </td>

                        <td className="p-3">
                          ₹{item.library}
                        </td>

                        <td className="p-3 font-semibold text-blue-600">
                          ₹{item.total}
                        </td>

                        <td className="p-3">

                          {isPaid ? (
                            <span className="text-green-600 font-semibold">
                              Completed
                            </span>
                          ) : (
                            isSelected && (
                              <button
                                onClick={() =>
                                  openMonthlyPayment(
                                    item.total,
                                    item.month
                                  )
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                              >
                                Pay ₹{item.total}
                              </button>
                            )
                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* PAYMENT HISTORY */}
          <div className="bg-white p-5 rounded-xl shadow border">

            <h2 className="text-lg font-semibold mb-3">
              Payment History
            </h2>

            {fee.history.length === 0 ? (
              <p className="text-gray-400">
                No payments yet
              </p>
            ) : (
              <div className="space-y-3">

                {fee.history.map((p) => (

                  <div
                    key={p.id}
                    className="flex justify-between items-center border rounded-lg p-3"
                  >

                    <div>
                      <p className="font-medium">
                        ₹{p.amount}
                      </p>

                      <p className="text-xs text-gray-500">
                        {p.date}
                      </p>
                    </div>

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          generateReceipt(student, p)
                        }
                        className="text-blue-600 text-sm"
                      >
                        Download Receipt
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(p.id)
                        }
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

        </main>
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

            <h2 className="text-xl font-semibold">
              Payment
            </h2>

            <div className="flex gap-2">

              {["card", "netbanking", "upi"].map((m) => (

                <button
                  key={m}
                  onClick={() =>
                    setPaymentMethod(m)
                  }
                  className={`px-3 py-1 rounded border ${
                    paymentMethod === m
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  {m}
                </button>

              ))}

            </div>

            {paymentMethod === "card" && (
              <input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            )}

            {paymentMethod === "netbanking" && (
              <select
                value={bank}
                onChange={(e) =>
                  setBank(e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                {banks.map((b) => (
                  <option key={b}>
                    {b}
                  </option>
                ))}
              </select>
            )}

            {paymentMethod === "upi" && (
              <input
                placeholder="UPI ID"
                value={upi}
                onChange={(e) =>
                  setUpi(e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            )}

            <div className="flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              {!paymentStatus && (
                <button
                  onClick={
                    handleConfirmPayment
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {processing
                    ? "Processing..."
                    : `Pay ₹${paymentAmount}`}
                </button>
              )}

            </div>

            {paymentStatus === "success" && (
              <div className="flex justify-center text-green-600 gap-2">
                <CheckCircle />
                Success
              </div>
            )}

            {paymentStatus === "fail" && (
              <div className="flex justify-center text-red-600 gap-2">
                <XCircle />
                Failed
              </div>
            )}

          </div>

        </div>

      )}
    </div>
  );
};

export default StudentFee;