import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Calendar,
  BarChart,
  BookOpen,
  MessageSquare,
  CreditCard,
  FileText,
  Briefcase   // ✅ Placement Icon
} from "lucide-react";
import EdusphereLogo from "../assets/Edusphere.jpg";

const StudentSidebar = () => {
  const location = useLocation();

  const itemClass = (path) =>
    `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "hover:bg-blue-50 text-gray-700"
    }`;

  return (
    <div className="w-64 h-screen bg-white shadow-sm border-r flex flex-col p-5 space-y-6">

      {/* ---- TOP LOGO SECTION ---- */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={EdusphereLogo}
          alt="EduSphere Logo"
          className="w-12 h-12 rounded-xl object-cover shadow-md border"
        />
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
          EduSphere
        </h1>
      </div>

      {/* ---- MENU SECTIONS ---- */}
      <div className="space-y-3">

        {/* Dashboard Section */}
        <p className="text-gray-400 uppercase text-sm">Dashboard</p>
        <Link to="/student/dashboard" className={itemClass("/student/dashboard")}>
          <Home size={20} />
          Dashboard
        </Link>

        {/* Academics */}
        <p className="text-gray-400 uppercase text-sm mt-6">Academics</p>

        <Link to="/student/assignments" className={itemClass("/student/assignments")}>
          <ClipboardList size={20} />
          Assignments
        </Link>

        <Link to="/student/exams" className={itemClass("/student/exams")}>
          <Calendar size={20} />
          Exam Timetable
        </Link>

        <Link to="/student/results" className={itemClass("/student/results")}>
          <BarChart size={20} />
          Results
        </Link>

        <Link to="/student/attendance" className={itemClass("/student/attendance")}>
          <BookOpen size={20} />
          Attendance
        </Link>

        {/* Schedule */}
        <p className="text-gray-400 uppercase text-sm mt-6">Schedule</p>

        <Link to="/student/calendar" className={itemClass("/student/calendar")}>
          <Calendar size={20} />
          Academic Calendar
        </Link>

        <Link to="/student/timetable" className={itemClass("/student/timetable")}>
          <Calendar size={20} />
          Timetable
        </Link>

        {/* Campus */}
        <p className="text-gray-400 uppercase text-sm mt-6">Campus</p>

        <Link to="/student/library" className={itemClass("/student/library")}>
          <BookOpen size={20} />
          Library
        </Link>

        <Link to="/student/inbox" className={itemClass("/student/inbox")}>
          <MessageSquare size={20} />
          Inbox
        </Link>

        {/* Resources */}
        <p className="text-gray-400 uppercase text-sm mt-6">Resources</p>

        <Link to="/student/fees" className={itemClass("/student/fees")}>
          <CreditCard size={20} />
          Fees
        </Link>

        <Link to="/student/study-material" className={itemClass("/student/study-material")}>
          <FileText size={20} />
          Study Material
        </Link>

        {/* Placement Section */}
        <p className="text-gray-400 uppercase text-sm mt-6">Placement</p>

        <Link to="/student/placement" className={itemClass("/student/placement")}>
          <Briefcase size={20} />
          Placement Cell
        </Link>

      </div>
    </div>
  );
};

export default StudentSidebar;