import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function PlacementDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [companyForm, setCompanyForm] = useState({
    name: "",
    location: "",
  });

  const [jobForm, setJobForm] = useState({
  company: "",
  role: "",
  jobType: "",   
  ctc: "",
  stipend: "",
  minCGPA: "",
  eligibleCourses: [],
  deadline: "",
  jdFile: null,
});

  const coursesList = [
    "BCA",
    "BSc IT",
    "BTech CSE",
    "MCA",
    "BBA",
    "BCom",
    "BJMC",
  ];

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchCompanies();
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchCompanies = async () => {
    const res = await fetch("http://localhost:5000/api/companies");
    setCompanies(await res.json());
  };

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs/admin/all");
    setJobs(await res.json());
  };

  const fetchApplications = async () => {
    const res = await fetch("http://localhost:5000/api/applications");
    setApplications(await res.json());
  };

  /* ================= COMPANY ================= */

  const handleCompanySubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyForm),
    });

    const data = await res.json();
    setCompanies([...companies, data]);
    setCompanyForm({ name: "", location: "" });
  };

  const handleDeleteCompany = async (id) => {
    await fetch(`http://localhost:5000/api/companies/${id}`, {
      method: "DELETE",
    });
    setCompanies(companies.filter((c) => c._id !== id));
  };

  /* ================= JOB ================= */

  const handleJobSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(jobForm).forEach((key) => {
      if (key === "eligibleCourses") {
        formData.append(
          key,
          JSON.stringify(jobForm[key])
        );
      } else if (jobForm[key] !== null) {
        formData.append(key, jobForm[key]);
      }
    });

    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setJobs([...jobs, data]);

    setJobForm({
      company: "",
      role: "",
      jobType: "",
      ctc: "",
      stipend: "",
      minCGPA: "",
      eligibleCourses: [],
      deadline: "",
      jdFile: null,
    });
  };

  const handleDeleteJob = async (id) => {
    await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "DELETE",
    });
    setJobs(jobs.filter((j) => j._id !== id));
  };

  const handleCourseToggle = (course) => {
    const updated = jobForm.eligibleCourses.includes(course)
      ? jobForm.eligibleCourses.filter((c) => c !== course)
      : [...jobForm.eligibleCourses, course];

    setJobForm({ ...jobForm, eligibleCourses: updated });
  };

  /* ================= ANALYTICS ================= */

  
  /* ================= ANALYTICS ================= */

const handleExportApplicantsCSV = () => {
  if (!selectedJob) {
    alert("Select a job drive first");
    return;
  }

  const headers = [
    "Student Name",
    "Email",
    "CGPA",
    "Passing Year",
    "Job Role",
    "Company",
  ];

  const rows = [headers.join(",")];

  applications
    .filter((a) => a.job?._id === selectedJob._id)
    .forEach((a) => {
      rows.push(
        [
          a.studentName,
          a.studentEmail,
          a.cgpa,
          a.passingYear,
          selectedJob.role,
          selectedJob.company?.name,
        ].join(",")
      );
    });

  const blob = new Blob([rows.join("\n")], {
    type: "text/csv",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `${selectedJob.role}_Applicants.csv`;

  link.click();

  URL.revokeObjectURL(url);
};

const totalJobs = jobs.length;
const totalCompanies = companies.length;
const totalApplications = applications.length;

  /* ================= UI ================= */

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
    <Sidebar />
    <div className="flex-1">
      <Topbar />

      <main className="px-8 py-6 space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Placement Cell Admin
        </h1>

        {/* TABS */}
        <div className="flex gap-3">
          {["analytics", "companies", "jobs", "applicants"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                  : "bg-white border hover:bg-blue-50"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

          {/* ================= ANALYTICS ================= */}
          {activeTab === "analytics" && (
  <div className="space-y-8">

    {/* ===== STAT CARDS ===== */}
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-blue-100 p-6 rounded-xl shadow">
        <h2 className="text-3xl font-bold">{companies.length}</h2>
        <p>Total Companies</p>
      </div>

      <div className="bg-green-100 p-6 rounded-xl shadow">
        <h2 className="text-3xl font-bold">{jobs.length}</h2>
        <p>Total Job Drives</p>
      </div>

      <div className="bg-purple-100 p-6 rounded-xl shadow">
        <h2 className="text-3xl font-bold">{applications.length}</h2>
        <p>Total Applications</p>
      </div>
    </div>

    {/* ===== APPLICATIONS PER JOB BAR GRAPH ===== */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Applications Per Job
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={jobs.map((job) => ({
            name: job.role,
            applications: applications.filter(
              (a) => a.job?._id === job._id
            ).length,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="applications" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* ===== COURSE DISTRIBUTION PIE CHART ===== */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Applications by Course
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={
              Object.entries(
                applications.reduce((acc, app) => {
                  const course = app.course || "Unknown";
                  acc[course] = (acc[course] || 0) + 1;
                  return acc;
                }, {})
              ).map(([name, value]) => ({
                name,
                value,
              }))
            }
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {["#2563eb", "#16a34a", "#9333ea", "#f59e0b", "#ef4444"].map(
              (color, index) => (
                <Cell key={index} fill={color} />
              )
            )}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>
)}
          {/* ================= COMPANIES ================= */}
          {activeTab === "companies" && (
            <div className="space-y-6">

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">Add Company</h2>
                <form onSubmit={handleCompanySubmit} className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Company Name"
                    value={companyForm.name}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, name: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    placeholder="Location"
                    value={companyForm.location}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, location: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                  />
                  <button className="bg-blue-600 text-white py-2 rounded col-span-2">
                    Add Company
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">Company List</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Location</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((c) => (
                      <tr key={c._id}>
                        <td className="p-2">{c.name}</td>
                        <td className="p-2">{c.location}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteCompany(c._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ================= JOBS ================= */}
                    {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">Post Job Drive</h2>

                <form onSubmit={handleJobSubmit} className="grid grid-cols-2 gap-4">

                  <select
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <input
                  placeholder="Role"
                  value={jobForm.role}
                  onChange={(e)=>setJobForm({...jobForm,role:e.target.value})}
                  className="border p-2 rounded"
                  required
                />

                <select
                  value={jobForm.jobType}
                  onChange={(e)=>setJobForm({...jobForm,jobType:e.target.value})}
                  className="border p-2 rounded"
                  required
                >

                  <option value="">Select Job Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>

                </select>
                  <input
                    placeholder="CTC"
                    value={jobForm.ctc}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, ctc: e.target.value })
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="Stipend"
                    value={jobForm.stipend}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, stipend: e.target.value })
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Minimum CGPA"
                    value={jobForm.minCGPA}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, minCGPA: e.target.value })
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    type="date"
                    value={jobForm.deadline}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, deadline: e.target.value })
                    }
                    className="border p-2 rounded"
                  />

                  <div className="col-span-2">
                    <p className="font-medium mb-2">Eligible Courses</p>
                    {coursesList.map((course) => (
                      <label key={course} className="mr-4">
                        <input
                          type="checkbox"
                          checked={jobForm.eligibleCourses.includes(course)}
                          onChange={() => handleCourseToggle(course)}
                        />{" "}
                        {course}
                      </label>
                    ))}
                  </div>

                  <div className="col-span-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          jdFile: e.target.files[0],
                        })
                      }
                    />
                  </div>

                  <button className="bg-blue-600 text-white py-2 rounded col-span-2">
                    Post Job
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">Job Drives</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-2 text-left">Company</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Deadline</th>
                      <th className="p-2 text-left">JD</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j._id}>
                        <td className="p-2">{j.company?.name}</td>
                        <td className="p-2">{j.role}</td>
                        <td className="p-2">{j.deadline?.slice(0, 10)}</td>
                        <td className="p-2">
                          {j.jdFile && (
                            <a
                              href={`http://localhost:5000/uploads/${j.jdFile}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline"
                            >
                              View JD
                            </a>
                          )}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteJob(j._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= APPLICANTS ================= */}
          {activeTab === "applicants" && (

  <div className="grid grid-cols-3 gap-6">

    {/* ===== JOB LIST ===== */}

    <div className="bg-white p-6 rounded-xl shadow col-span-1">

      <h2 className="font-semibold mb-4">Job Drives</h2>

      {jobs.length === 0 && (
        <p className="text-gray-500">No jobs posted</p>
      )}

      {jobs.map((job) => (

        <div
          key={job._id}
          onClick={() => setSelectedJob(job)}
          className={`p-3 border rounded mb-3 cursor-pointer hover:bg-blue-50 ${
            selectedJob?._id === job._id
              ? "bg-blue-100"
              : ""
          }`}
        >

          <p className="font-medium">{job.role}</p>

          <p className="text-sm text-gray-500">
            {job.company?.name}
          </p>

          <p className="text-xs text-gray-400">
            Deadline: {job.deadline?.slice(0, 10)}
          </p>

        </div>

      ))}

    </div>

    {/* ===== APPLICANTS LIST ===== */}

    <div className="bg-white p-6 rounded-xl shadow col-span-2">

      <div className="flex justify-between items-center mb-4">

  <h2 className="font-semibold">
    Applicants
  </h2>

  {selectedJob && (
    <button
      onClick={handleExportApplicantsCSV}
      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
    >
      Export CSV
    </button>
  )}

</div>

      {!selectedJob && (
        <p className="text-gray-500">
          Select a job drive to view applicants
        </p>
      )}

      {selectedJob && (

        <table className="w-full text-sm">

          <thead>

            <tr className="bg-blue-600 text-white">

              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">CGPA</th>
              <th className="p-2 text-left">Passing Year</th>
              <th className="p-2 text-left">Resume</th>

            </tr>

          </thead>

          <tbody>

            {applications
              .filter((a) => a.job?._id === selectedJob._id)
              .map((a) => (

                <tr key={a._id} className="border-b">

                  <td className="p-2">{a.studentName}</td>

                  <td className="p-2">{a.studentEmail}</td>

                  <td className="p-2">{a.cgpa}</td>

                  <td className="p-2">{a.passingYear}</td>

                  <td className="p-2">

                    {a.resume && (

                      <a
                        href={`http://localhost:5000/uploads/${a.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>

                    )}

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      )}

    </div>

  </div>

)}

        </main>
      </div>
    </div>
  );
}