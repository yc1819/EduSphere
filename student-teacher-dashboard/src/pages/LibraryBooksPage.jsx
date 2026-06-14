import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// 🔥 localStorage helpers
const getRequests = () =>
  JSON.parse(localStorage.getItem("book_requests")) || [];

const updateRequest = (id, status) => {
  const updated = getRequests().map((r) =>
    r.id === id ? { ...r, status } : r
  );
  localStorage.setItem("book_requests", JSON.stringify(updated));
};

const LibraryBooksPage = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "JavaScript Basics", author: "John Doe", issued: false },
    { id: 2, title: "React in Depth", author: "Jane Smith", issued: true },
    { id: 3, title: "Python Programming", author: "Alice Brown", issued: false },
  ]);

  const [requests, setRequests] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) return;

    setBooks([
      ...books,
      {
        id: Date.now(),
        title: newBook.title,
        author: newBook.author,
        issued: false,
      },
    ]);

    setNewBook({ title: "", author: "" });
  };

  const handleDelete = (id) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  const toggleIssued = (id) => {
    setBooks(
      books.map((b) =>
        b.id === id ? { ...b, issued: !b.issued } : b
      )
    );
  };

  // ✅ APPROVE REQUEST
  const handleApprove = (req) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === req.bookId ? { ...b, issued: true } : b
      )
    );

    updateRequest(req.id, "approved");
    setRequests(getRequests());
  };

  // ❌ REJECT REQUEST
  const handleReject = (req) => {
    updateRequest(req.id, "rejected");
    setRequests(getRequests());
  };

  // 🔁 RETURN BOOK
  const handleReturn = (id) => {
    setBooks(
      books.map((b) =>
        b.id === id ? { ...b, issued: false } : b
      )
    );
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const issuedCount = books.filter((b) => b.issued).length;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Library Management</h1>

            <div className="flex gap-3">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                Issued: {issuedCount}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
                Total: {books.length}
              </span>
            </div>
          </div>

          {/* 📥 REQUEST PANEL */}
          <div className="bg-white p-6 rounded-xl shadow border mb-6">
            <h2 className="text-xl font-semibold mb-4">Book Requests</h2>

            {requests.length === 0 ? (
              <p className="text-gray-500">No requests yet</p>
            ) : (
              requests.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center border p-3 rounded mb-2"
                >
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-sm text-gray-500">{r.student}</p>
                  </div>

                  <div className="flex gap-2">
                    {r.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(r)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {r.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ADD BOOK (UNCHANGED) */}
          <div className="bg-white p-6 rounded-xl shadow border mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Book</h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Book Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="border px-3 py-2 rounded flex-1"
              />

              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                className="border px-3 py-2 rounded flex-1"
              />

              <button
                onClick={handleAddBook}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full mb-6"
          />

          {/* BOOK LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded shadow border">
                <h2 className="font-bold">{b.title}</h2>
                <p className="text-sm text-gray-500">{b.author}</p>

                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      b.issued
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {b.issued ? "Issued" : "Available"}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => toggleIssued(b.id)}
                    className="text-blue-600 text-sm"
                  >
                    Toggle
                  </button>

                  {b.issued && (
                    <button
                      onClick={() => handleReturn(b.id)}
                      className="text-green-600 text-sm"
                    >
                      Return
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LibraryBooksPage;