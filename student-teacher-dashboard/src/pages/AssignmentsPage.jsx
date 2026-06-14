import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import {
  getAssignments,
  addAssignment,
  removeAssignment,
  updateAssignment,
  fileToBase64,
  getAllSubmissionsForAssignment,
} from "../storage/assignmentsStorage";

const AssignmentsPage = () => {

  const [assignments, setAssignments] =
    useState([]);

  const [submissions, setSubmissions] =
    useState({});

  const [expandedRow, setExpandedRow] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [submissionDate, setSubmissionDate] =
    useState("");

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [editDate, setEditDate] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  // ✅ LOAD ASSIGNMENTS + SUBMISSIONS
  useEffect(() => {

    const allAssignments =
      getAssignments();

    setAssignments(allAssignments);

    const allSubs = {};

    allAssignments.forEach((a) => {

      const assignmentSubs =
        getAllSubmissionsForAssignment(
          a.id
        );

      // ✅ FIX OLD SUBMISSIONS WITHOUT NAME
      const updatedSubs =
        assignmentSubs.map((s) => ({
          ...s,
          studentName:
            s.studentName ||
            "Unknown Student",
        }));

      allSubs[a.id] =
        updatedSubs;
    });

    setSubmissions(allSubs);

  }, []);

  // ✅ UPLOAD ASSIGNMENT
  const uploadAssignment =
    async () => {

      if (!file || !title)
        return;

      const fileBase64 =
        await fileToBase64(file);

      const newAssignment = {
        id: Date.now(),
        title,
        name: file.name,
        size:
          (
            file.size / 1024
          ).toFixed(1) + " KB",
        date:
          new Date().toLocaleString(),
        fileData: fileBase64,
        lastSubmission:
          submissionDate ||
          "Not set",
      };

      addAssignment(
        newAssignment
      );

      setAssignments(
        getAssignments()
      );

      setFile(null);

      setTitle("");

      setSubmissionDate("");
    };

  // ✅ DELETE ASSIGNMENT
  const remove = (id) => {

    removeAssignment(id);

    setAssignments(
      getAssignments()
    );

    const updatedSubs = {
      ...submissions,
    };

    delete updatedSubs[id];

    setSubmissions(
      updatedSubs
    );
  };

  // ✅ DOWNLOAD FILE
  const downloadFile = (
    fileData,
    filename
  ) => {

    const link =
      document.createElement("a");

    fetch(fileData)
      .then((res) =>
        res.blob()
      )
      .then((blob) => {

        const url =
          URL.createObjectURL(
            blob
          );

        link.href = url;

        link.download =
          filename;

        link.click();
      });
  };

  // ✅ OPEN EDIT MODAL
  const openEditModal = (
    id,
    currentDate
  ) => {

    setEditId(id);

    setEditDate(
      currentDate ===
        "Not set"
        ? ""
        : currentDate
    );

    setEditModalOpen(
      true
    );
  };

  // ✅ SAVE DATE
  const saveUpdatedDate =
    () => {

      updateAssignment(
        editId,
        {
          lastSubmission:
            editDate,
        }
      );

      setAssignments(
        getAssignments()
      );

      setEditModalOpen(
        false
      );
    };

  // ✅ SEARCH FILTER
  const filteredAssignments =
    assignments.filter((a) =>
      a.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-8">

          <h1 className="text-2xl font-bold mb-4">
            Assignments
          </h1>

          {/* UPLOAD */}
          <div className="bg-white shadow p-6 rounded-xl border mb-6">

            <h2 className="text-lg font-semibold mb-3">
              Upload Assignment
            </h2>

            <input
              placeholder="Assignment title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="file"
              className="border p-2 rounded w-full mb-3"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
            />

            <input
              type="date"
              value={
                submissionDate
              }
              onChange={(e) =>
                setSubmissionDate(
                  e.target.value
                )
              }
              className="border p-2 rounded w-full mb-3"
            />

            <button
              onClick={
                uploadAssignment
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Upload
            </button>

          </div>

          {/* SEARCH */}
          <input
            placeholder="Search assignments..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border p-2 rounded w-full mb-4"
          />

          {/* ASSIGNMENT CARDS */}
          <div className="space-y-4">

            {filteredAssignments.length ===
            0 ? (

              <p className="text-gray-500">
                No assignments found
              </p>

            ) : (

              filteredAssignments.map(
                (a) => (

                  <div
                    key={a.id}
                    className="bg-white p-5 rounded-xl shadow border"
                  >

                    {/* HEADER */}
                    <div className="flex justify-between">

                      <div>

                        <h2 className="text-lg font-bold">
                          {a.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {a.name} •{" "}
                          {a.size}
                        </p>

                      </div>

                      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                        {a.date}
                      </span>

                    </div>

                    {/* DUE DATE */}
                    <p className="text-sm mt-2">

                      Last Date:{" "}

                      <span className="text-red-500 font-semibold">

                        {a.lastSubmission ||
                          a.dueDate ||
                          "Not set"}

                      </span>

                    </p>

                    {/* ACTIONS */}
                    <div className="flex gap-4 mt-3 text-sm">

                      <button
                        className="text-blue-600"
                        onClick={() =>
                          setExpandedRow(
                            expandedRow ===
                              a.id
                              ? null
                              : a.id
                          )
                        }
                      >
                        View Submissions (
                        {submissions[a.id]
                          ?.length || 0}
                        )
                      </button>

                      <button
                        className="text-yellow-600"
                        onClick={() =>
                          openEditModal(
                            a.id,
                            a.lastSubmission ||
                              a.dueDate
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-600"
                        onClick={() =>
                          remove(a.id)
                        }
                      >
                        Delete
                      </button>

                      <button
                        className="text-green-600"
                        onClick={() =>
                          downloadFile(
                            a.fileData,
                            a.name
                          )
                        }
                      >
                        Download
                      </button>

                    </div>

                    {/* PDF PREVIEW */}
                    <div className="mt-3">

                      <iframe
                        src={a.fileData}
                        title="preview"
                        className="w-full h-48 border rounded"
                      />

                    </div>

                    {/* SUBMISSIONS */}
                    {expandedRow ===
                      a.id && (

                      <div className="mt-4 bg-gray-50 p-4 rounded">

                        <h3 className="font-semibold mb-2">
                          Submissions
                        </h3>

                        {submissions[a.id]
                          ?.length ? (

                          submissions[
                            a.id
                          ].map(
                            (
                              s,
                              idx
                            ) => (

                              <div
                                key={idx}
                                className="flex justify-between border p-2 rounded mb-2 bg-white"
                              >

                                <span>

                                  <b>
                                    {s.studentName ||
                                      "Unknown Student"}
                                  </b>{" "}

                                  -{" "}

                                  {s.submittedAt}

                                </span>

                                <button
                                  onClick={() =>
                                    downloadFile(
                                      s.fileData,
                                      `${
                                        s.studentName ||
                                        "Student"
                                      }_${
                                        a.title
                                      }`
                                    )
                                  }
                                  className="text-blue-600"
                                >
                                  Download
                                </button>

                              </div>

                            )
                          )

                        ) : (

                          <p className="text-gray-500">
                            No submissions yet
                          </p>

                        )}

                      </div>

                    )}

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {editModalOpen && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[350px]">

            <h2 className="text-lg font-semibold mb-4">
              Edit Date
            </h2>

            <input
              type="date"
              value={editDate}
              onChange={(e) =>
                setEditDate(
                  e.target.value
                )
              }
              className="border p-2 w-full mb-4 rounded"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setEditModalOpen(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                onClick={
                  saveUpdatedDate
                }
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AssignmentsPage;