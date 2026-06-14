import { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import AssignmentCard from "../components/AssignmentCard";

import {
  getAssignments,
  saveStudentSubmission,
  getStudentSubmissions,
} from "../storage/assignmentsStorage";

const StudentAssignments = () => {

  const [assignments, setAssignments] =
    useState([]);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [submissionFile, setSubmissionFile] =
    useState(null);

  const [submissions, setSubmissions] =
    useState({});

  const [search, setSearch] =
    useState("");

  // ✅ CURRENT STUDENT ID
  const studentId =
    localStorage.getItem(
      "currentStudentId"
    ) || "s1";

  // ✅ GET STUDENTS FROM LOCALSTORAGE
  const students =
    JSON.parse(
      localStorage.getItem(
        "students"
      )
    ) ||

    JSON.parse(
      localStorage.getItem(
        "allStudents"
      )
    ) ||

    [];

  // ✅ CURRENT STUDENT
  const currentStudent =
    students.find(
      (s) =>

        String(s.id) ===
          String(studentId) ||

        String(s.roll) ===
          String(studentId) ||

        String(s.studentId) ===
          String(studentId)
    );

  // ✅ LOAD ASSIGNMENTS + STUDENT SUBMISSIONS
  useEffect(() => {

    setAssignments(
      getAssignments() || []
    );

    const studentSubs =
      getStudentSubmissions(
        studentId
      ) || {};

    setSubmissions(
      studentSubs
    );

  }, [studentId]);

  // ✅ FILE CHANGE
  const handleFileChange = (
    e
  ) => {

    if (
      e.target.files.length >
      0
    ) {

      setSubmissionFile(
        e.target.files[0]
      );

    }
  };

  // ✅ SUBMIT ASSIGNMENT
  const handleSubmitAssignment =
    () => {

      if (!submissionFile) {

        return alert(
          "Please select a file to submit."
        );

      }

      const fileUrl =
        URL.createObjectURL(
          submissionFile
        );

      // ✅ SUBMISSION DATA
      const submissionData = {

        studentId:
          String(
            currentStudent?.id ||
            studentId
          ),

        studentName:

          currentStudent?.name ||

          currentStudent?.studentName ||

          currentStudent?.fullName ||

          `Student ${studentId}`,

        fileData:
          fileUrl,

        submittedAt:
          new Date().toLocaleString(),
      };

      // ✅ SAVE TO STORAGE
      saveStudentSubmission(
        studentId,
        selectedAssignment.id,
        submissionData
      );

      // ✅ UPDATE UI
      setSubmissions(
        (prev) => ({
          ...prev,

          [selectedAssignment.id]:
            submissionData,
        })
      );

      alert(
        "Assignment submitted successfully!"
      );

      setSubmissionFile(
        null
      );

      setSelectedAssignment(
        null
      );
    };

  // ✅ SEARCH
  const filteredAssignments =
    assignments.filter((a) =>
      a.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <StudentSidebar />

      <div className="flex-1 p-6">

        <StudentTopbar />

        <h1 className="text-3xl font-bold mb-4">
          My Assignments
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search assignments..."
          className="border p-2 rounded w-full mb-6"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {/* ASSIGNMENTS */}
        {filteredAssignments.length ===
        0 ? (

          <p className="text-gray-500">
            No assignments available.
          </p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredAssignments.map(
              (
                assignment
              ) => (

                <div
                  key={
                    assignment.id
                  }
                  className="relative group transition transform hover:-translate-y-1"
                >

                  {/* SUBMITTED BADGE */}
                  {submissions[
                    assignment.id
                  ] && (

                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">

                      Submitted

                    </span>

                  )}

                  <AssignmentCard
                    title={
                      assignment.title ||
                      "Untitled"
                    }

                    dueDate={
                      assignment.lastSubmission ||
                      assignment.dueDate ||
                      "No due date"
                    }

                    teacher={
                      assignment.teacher ||
                      "Unknown"
                    }

                    onView={() =>
                      setSelectedAssignment(
                        assignment
                      )
                    }

                    submitted={
                      !!submissions[
                        assignment.id
                      ]
                    }
                  />

                </div>

              )
            )}

          </div>

        )}

        {/* MODAL */}
        {selectedAssignment && (

          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">

            <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-xl">

              {/* HEADER */}
              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">

                  {
                    selectedAssignment.title
                  }

                </h2>

                <button
                  onClick={() => {

                    setSelectedAssignment(
                      null
                    );

                    setSubmissionFile(
                      null
                    );
                  }}
                  className="text-red-500 font-bold text-lg"
                >
                  ✕
                </button>

              </div>

              {/* INFO */}
              <p className="text-gray-500 mt-2">

                Due:{" "}

                {selectedAssignment.lastSubmission ||
                  selectedAssignment.dueDate ||
                  "No due date"}

              </p>

              {selectedAssignment.teacher && (

                <p className="text-gray-600">

                  Teacher:{" "}
                  {
                    selectedAssignment.teacher
                  }

                </p>

              )}

              {/* PREVIEW */}
              {(selectedAssignment.file ||
                selectedAssignment.fileData) && (

                <div className="mt-4 border rounded overflow-hidden">

                  <iframe
                    src={
                      selectedAssignment.file ||
                      selectedAssignment.fileData
                    }
                    className="w-full h-64"
                  />

                  <div className="p-2">

                    <a
                      href={
                        selectedAssignment.file ||
                        selectedAssignment.fileData
                      }
                      download
                      className="text-blue-600 underline"
                    >
                      Download Assignment
                    </a>

                  </div>

                </div>

              )}

              {/* SUBMISSION */}
              <div className="mt-4">

                {submissions[
                  selectedAssignment.id
                ] ? (

                  <div className="bg-green-50 p-4 rounded">

                    <p className="text-green-700 font-semibold">
                      ✔ Submitted
                    </p>

                    <p className="text-sm text-gray-500">

                      {
                        submissions[
                          selectedAssignment.id
                        ]
                          .submittedAt
                      }

                    </p>

                    <a
                      href={
                        submissions[
                          selectedAssignment.id
                        ]
                          .fileData
                      }
                      download
                      className="mt-2 inline-block text-blue-600 underline"
                    >
                      Download Submission
                    </a>

                  </div>

                ) : (

                  <div className="bg-gray-50 p-4 rounded">

                    <input
                      type="file"
                      onChange={
                        handleFileChange
                      }
                      className="mb-3"
                    />

                    <button
                      onClick={
                        handleSubmitAssignment
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Submit Assignment
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default StudentAssignments;