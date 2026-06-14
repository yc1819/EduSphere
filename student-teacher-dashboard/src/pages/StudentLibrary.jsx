import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import {
  getBookRequests,
  addBookRequest,
} from "../storage/libraryStorage";

const StudentLibrary = () => {
  const [books] = useState([
    {
      id: 1,
      title: "JavaScript Basics",
      author: "John Doe",
      issued: false,
    },
    {
      id: 2,
      title: "React in Depth",
      author: "Jane Smith",
      issued: true,
    },
    {
      id: 3,
      title: "Python Programming",
      author: "Alice Brown",
      issued: false,
    },
  ]);

  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);

  // ✅ Dynamic Student Name
  const student =
    JSON.parse(localStorage.getItem("loggedInStudent")) ||
    JSON.parse(localStorage.getItem("student")) || {};

  const studentName =
    student.name ||
    student.fullName ||
    student.email ||
    `Student-${student.id || "1"}`;

  // 🔄 Load Requests
  useEffect(() => {
    setRequests(getBookRequests());
  }, []);

  // ✅ Request Book
  const handleRequestBook = (book) => {
    const alreadyRequested = requests.find(
      (r) =>
        r.bookId === book.id &&
        r.student === studentName
    );

    if (alreadyRequested) {
      alert("You already requested this book");
      return;
    }

    const newRequest = {
      id: Date.now(),
      bookId: book.id,
      title: book.title,
      student: studentName,
      status: "pending",
    };

    addBookRequest(newRequest);

    // refresh
    setRequests(getBookRequests());

    alert("Request sent to teacher!");
  };

  // 🔍 Filter Books
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Get Status Only For Current Student
  const getStatus = (bookId) => {
    const req = requests.find(
      (r) =>
        r.bookId === bookId &&
        r.student === studentName
    );

    return req?.status;
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <StudentSidebar />

      <div className="flex-1">
        <StudentTopbar />

        <div className="p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Library
            </h1>

            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm">
              {books.length} Books Available
            </span>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-2 rounded w-full mb-6"
          />

          {/* BOOKS */}
          {filteredBooks.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No books found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((b) => {
                const status = getStatus(b.id);

                return (
                  <div
                    key={b.id}
                    className="bg-white p-5 rounded-xl shadow border hover:shadow-lg transition"
                  >
                    {/* TITLE */}
                    <h2 className="text-lg font-semibold">
                      {b.title}
                    </h2>

                    {/* AUTHOR */}
                    <p className="text-sm text-gray-500 mt-1">
                      {b.author}
                    </p>

                    {/* AVAILABILITY */}
                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          b.issued
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {b.issued
                          ? "Issued"
                          : "Available"}
                      </span>
                    </div>

                    {/* ACTION */}
                    <div className="mt-4 flex justify-end">
                      {b.issued ? (
                        <span className="text-sm text-gray-400">
                          Not Available
                        </span>
                      ) : status === "approved" ? (
                        <span className="text-green-600 text-sm font-semibold">
                          Approved ✔
                        </span>
                      ) : status === "rejected" ? (
                        <span className="text-red-600 text-sm">
                          Rejected
                        </span>
                      ) : status === "pending" ? (
                        <span className="text-blue-500 text-sm">
                          Pending...
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleRequestBook(b)
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Request Book
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLibrary;