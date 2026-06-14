import { useEffect, useState } from "react";
import Sidebar from "../components/StudentSidebar";
import Topbar from "../components/StudentTopbar";
import emailjs from "@emailjs/browser";

export default function StudentPlacement() {

  const [jobs, setJobs] = useState([]);

  // ✅ STUDENT-WISE APPLIED JOBS
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);

  const [showApplyForm, setShowApplyForm] =
    useState(false);

  const [applicationData, setApplicationData] =
    useState({
      name: "",
      email: "",
      cgpa: "",
      passingYear: "",
      resume: null,
    });

  // ✅ CURRENT STUDENT
  const currentStudentId =
    localStorage.getItem("currentStudentId");

  // ✅ EMAILJS INIT
  useEffect(() => {
    emailjs.init("8sxz1OJRSh1ez11sx");
  }, []);

  // ✅ LOAD APPLIED JOBS
  useEffect(() => {
    if (currentStudentId) {
      const savedAppliedJobs =
        localStorage.getItem(
          `appliedJobs_${currentStudentId}`
        );

      setAppliedJobs(
        savedAppliedJobs
          ? JSON.parse(savedAppliedJobs)
          : []
      );
    }
  }, [currentStudentId]);

  // ✅ SEND EMAIL
  const sendEmail = async () => {

    const templateParams = {
      name: applicationData.name,
      email: applicationData.email,
      job: selectedJob?.role,
    };

    try {
      await emailjs.send(
        "service_rz0j3cr",
        "template_3q76ob1",
        templateParams
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FETCH JOBS
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/jobs"
      );

      const data = await res.json();

      setJobs(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ OPEN APPLY FORM
  const openApplyForm = (job) => {

    // ✅ ALREADY APPLIED CHECK
    if (
      appliedJobs.includes(job._id)
    ) {
      alert(
        "You have already applied for this job."
      );

      return;
    }

    setSelectedJob(job);

    setShowApplyForm(true);
  };

  // ✅ SUBMIT APPLICATION
  const handleApplySubmit = async (e) => {
    e.preventDefault();

    // ✅ DOUBLE CHECK
    if (
      appliedJobs.includes(
        selectedJob._id
      )
    ) {
      alert(
        "You have already applied for this job."
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "job",
      selectedJob._id
    );

    formData.append(
      "name",
      applicationData.name
    );

    formData.append(
      "email",
      applicationData.email
    );

    formData.append(
      "cgpa",
      applicationData.cgpa
    );

    formData.append(
      "passingYear",
      applicationData.passingYear
    );

    if (
      applicationData.resume
    ) {
      formData.append(
        "resume",
        applicationData.resume
      );
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await res.json();

      if (res.ok) {

        // ✅ EMAIL
        await sendEmail();

        alert(
          "Application Submitted 🎉"
        );

        // ✅ SAVE APPLIED JOB
        const updatedAppliedJobs =
          [
            ...appliedJobs,
            selectedJob._id,
          ];

        setAppliedJobs(
          updatedAppliedJobs
        );

        // ✅ SAVE STUDENT-WISE
        localStorage.setItem(
          `appliedJobs_${currentStudentId}`,
          JSON.stringify(
            updatedAppliedJobs
          )
        );

        setShowApplyForm(false);

        setApplicationData({
          name: "",
          email: "",
          cgpa: "",
          passingYear: "",
          resume: null,
        });

      } else {

        alert(
          data.message ||
            "Application failed"
        );

      }

    } catch (error) {

      console.log(error);

    }
  };

  // ✅ STATS
  const totalJobs =
    jobs.length;

  const appliedCount =
    appliedJobs.length;

  const upcomingDeadlines =
    jobs.filter(
      (job) =>
        new Date(job.deadline) >
        new Date()
    ).length;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-6 space-y-6">

          {/* HEADER */}
          <div>

            <h1 className="text-3xl font-semibold text-gray-800">
              Placement Dashboard
            </h1>

            <p className="text-gray-500 text-sm">
              Apply to jobs & track applications
            </p>

          </div>

          {/* KPI CARDS */}
          <div className="grid md:grid-cols-3 gap-4">

            <div className="bg-white p-5 rounded-xl shadow border">

              <p className="text-sm text-gray-500">
                Total Jobs
              </p>

              <h2 className="text-2xl font-semibold">
                {totalJobs}
              </h2>

            </div>

            <div className="bg-white p-5 rounded-xl shadow border">

              <p className="text-sm text-gray-500">
                Applied
              </p>

              <h2 className="text-2xl font-semibold text-green-600">
                {appliedCount}
              </h2>

            </div>

            <div className="bg-white p-5 rounded-xl shadow border">

              <p className="text-sm text-gray-500">
                Active Deadlines
              </p>

              <h2 className="text-2xl font-semibold text-red-500">
                {upcomingDeadlines}
              </h2>

            </div>

          </div>

          {/* JOB TABLE */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">

            <div className="p-4 border-b">

              <h2 className="font-semibold text-lg">
                Available Opportunities
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">

                  <tr>

                    <th className="p-3 text-left">
                      Company
                    </th>

                    <th className="p-3 text-left">
                      Role
                    </th>

                    <th className="p-3 text-left">
                      Package
                    </th>

                    <th className="p-3 text-left">
                      Deadline
                    </th>

                    <th className="p-3 text-left">
                      JD
                    </th>

                    <th className="p-3 text-left">
                      Apply
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {jobs.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-400"
                      >
                        No job drives available
                      </td>
                    </tr>
                  )}

                  {jobs.map((job) => {

                    const deadlinePassed =
                      new Date(
                        job.deadline
                      ) <
                      new Date();

                    const alreadyApplied =
                      appliedJobs.includes(
                        job._id
                      );

                    return (
                      <tr
                        key={job._id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-3 font-medium text-gray-700">
                          {
                            job.company
                              ?.name
                          }
                        </td>

                        <td className="p-3">
                          {job.role}
                        </td>

                        <td className="p-3">
                          {job.ctc ||
                            job.stipend ||
                            "N/A"}
                        </td>

                        <td className="p-3 text-gray-500">
                          {job.deadline?.slice(
                            0,
                            10
                          )}
                        </td>

                        <td className="p-3">

                          <button
                            onClick={() =>
                              setSelectedJob(
                                job
                              )
                            }
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </button>

                        </td>

                        <td className="p-3">

                          {deadlinePassed ? (
                            <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                              Closed
                            </span>
                          ) : alreadyApplied ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                              Applied
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                openApplyForm(
                                  job
                                )
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Apply
                            </button>
                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>

      {/* APPLY MODAL */}
      {showApplyForm &&
        selectedJob && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">

            <h2 className="text-xl font-semibold">
              Apply for{" "}
              {
                selectedJob.role
              }
            </h2>

            <form
              onSubmit={
                handleApplySubmit
              }
              className="space-y-3"
            >

              <input
                placeholder="Full Name"
                value={
                  applicationData.name
                }
                onChange={(e) =>
                  setApplicationData(
                    {
                      ...applicationData,
                      name:
                        e.target
                          .value,
                    }
                  )
                }
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={
                  applicationData.email
                }
                onChange={(e) =>
                  setApplicationData(
                    {
                      ...applicationData,
                      email:
                        e.target
                          .value,
                    }
                  )
                }
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="number"
                placeholder="CGPA"
                value={
                  applicationData.cgpa
                }
                onChange={(e) =>
                  setApplicationData(
                    {
                      ...applicationData,
                      cgpa:
                        e.target
                          .value,
                    }
                  )
                }
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="number"
                placeholder="Passing Year"
                value={
                  applicationData.passingYear
                }
                onChange={(e) =>
                  setApplicationData(
                    {
                      ...applicationData,
                      passingYear:
                        e.target
                          .value,
                    }
                  )
                }
                className="border p-2 rounded w-full"
                required
              />

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setApplicationData(
                    {
                      ...applicationData,
                      resume:
                        e.target
                          .files[0],
                    }
                  )
                }
                className="border p-2 rounded w-full"
                required
              />

              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowApplyForm(
                      false
                    )
                  }
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Submit
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}