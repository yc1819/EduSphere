const KEY = "assignments";

const SUBMISSIONS_KEY =
  "student_submissions";

// ------------------------
// ASSIGNMENTS CRUD
// ------------------------

// ✅ GET ALL ASSIGNMENTS
export const getAssignments =
  () => {

    const data =
      localStorage.getItem(
        KEY
      );

    try {

      return data
        ? JSON.parse(data)
        : [];

    } catch {

      return [];

    }
  };

// ✅ SAVE ASSIGNMENTS
export const saveAssignments =
  (assignments) => {

    localStorage.setItem(
      KEY,
      JSON.stringify(
        assignments
      )
    );
  };

// ✅ ADD ASSIGNMENT
export const addAssignment =
  (assignment) => {

    const assignments =
      getAssignments();

    assignments.push(
      assignment
    );

    saveAssignments(
      assignments
    );
  };

// ✅ REMOVE ASSIGNMENT
export const removeAssignment =
  (id) => {

    const assignments =
      getAssignments().filter(
        (a) =>
          a.id !== id
      );

    saveAssignments(
      assignments
    );

    // ✅ REMOVE RELATED SUBMISSIONS
    const submissions =
      JSON.parse(
        localStorage.getItem(
          SUBMISSIONS_KEY
        )
      ) || {};

    Object.keys(
      submissions
    ).forEach(
      (studentId) => {

        if (
          submissions[
            studentId
          ]?.[id]
        ) {

          delete submissions[
            studentId
          ][id];

        }
      }
    );

    localStorage.setItem(
      SUBMISSIONS_KEY,
      JSON.stringify(
        submissions
      )
    );
  };

// ✅ UPDATE ASSIGNMENT
export const updateAssignment =
  (
    id,
    updatedFields
  ) => {

    const assignments =
      getAssignments();

    const updatedAssignments =
      assignments.map(
        (a) =>

          a.id === id
            ? {
                ...a,
                ...updatedFields,
              }
            : a
      );

    saveAssignments(
      updatedAssignments
    );
  };

// ✅ FILE TO BASE64
export const fileToBase64 =
  (file) =>

    new Promise(
      (
        resolve,
        reject
      ) => {

        const reader =
          new FileReader();

        reader.onload =
          () =>
            resolve(
              reader.result
            );

        reader.onerror = (
          error
        ) =>
          reject(
            error
          );

        reader.readAsDataURL(
          file
        );
      }
    );

// ------------------------
// STUDENT SUBMISSIONS
// ------------------------

// ✅ SAVE STUDENT SUBMISSION
export const saveStudentSubmission =
  (
    studentId,
    assignmentId,
    submissionData
  ) => {

    const submissions =
      JSON.parse(
        localStorage.getItem(
          SUBMISSIONS_KEY
        )
      ) || {};

    // ✅ CREATE STUDENT OBJECT
    if (
      !submissions[
        studentId
      ]
    ) {

      submissions[
        studentId
      ] = {};

    }

    // ✅ SAVE ONLY FOR CURRENT STUDENT
    submissions[
      studentId
    ][assignmentId] = {
      ...submissionData,
    };

    localStorage.setItem(
      SUBMISSIONS_KEY,
      JSON.stringify(
        submissions
      )
    );
  };

// ✅ GET CURRENT STUDENT SUBMISSIONS
export const getStudentSubmissions =
  (studentId) => {

    const submissions =
      JSON.parse(
        localStorage.getItem(
          SUBMISSIONS_KEY
        )
      ) || {};

    // ✅ RETURN ONLY CURRENT STUDENT
    return (
      submissions[
        studentId
      ] || {}
    );
  };

// ✅ GET SINGLE SUBMISSION
export const getStudentSubmission =
  (
    studentId,
    assignmentId
  ) => {

    const submissions =
      JSON.parse(
        localStorage.getItem(
          SUBMISSIONS_KEY
        )
      ) || {};

    return (
      submissions[
        studentId
      ]?.[
        assignmentId
      ] || null
    );
  };

// ✅ GET ALL SUBMISSIONS FOR TEACHER
export const getAllSubmissionsForAssignment =
  (
    assignmentId
  ) => {

    const submissions =
      JSON.parse(
        localStorage.getItem(
          SUBMISSIONS_KEY
        )
      ) || {};

    const result = [];

    Object.keys(
      submissions
    ).forEach(
      (studentId) => {

        const studentSubs =
          submissions[
            studentId
          ];

        // ✅ IF SUBMITTED
        if (
          studentSubs?.[
            assignmentId
          ]
        ) {

          result.push({
            studentId,

            ...studentSubs[
              assignmentId
            ],
          });

        }
      }
    );

    return result;
  };