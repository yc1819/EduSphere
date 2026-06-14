import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  Calendar,
  GraduationCap,
  FileBarChart,
  UserCheck,
  BookOpen,
  MessageSquare,
  IndianRupee,
  FileText,
  Briefcase   // 🔥 NEW ICON
} from "lucide-react";
import EdusphereBg from "../assets/Edusphere.jpg";

const Sidebar = () => {
  const location = useLocation();

  const dashboardPath = "/teacher";

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
          src={EdusphereBg}
          alt="EduSphere Logo"
          className="w-12 h-12 rounded-xl object-cover shadow-md border"
        />
        <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
          EduSphere
        </h1>
      </div>

      {/* ---- MENU ITEMS ---- */}
      <div className="space-y-3">

        <p className="text-gray-400 uppercase text-sm">Dashboard</p>
        <Link to={dashboardPath} className={itemClass(dashboardPath)}>
          <Home size={20} />
          Dashboard
        </Link>

        <p className="text-gray-400 uppercase text-sm mt-6">Class Info</p>
        <Link to="/students" className={itemClass("/students")}>
          <Users size={20} />
          Students
        </Link>
        <Link to="/assignments" className={itemClass("/assignments")}>
          <ClipboardList size={20} />
          Assignments
        </Link>
        <Link to="/timetable" className={itemClass("/timetable")}>
          <Calendar size={20} />
          Time Table
        </Link>
        <Link to="/calendar" className={itemClass("/calendar")}>
          <Calendar size={20} />
          Calendar
        </Link>
        <Link to="/examinations" className={itemClass("/examinations")}>
          <FileBarChart size={20} />
          Examinations
        </Link>
        <Link to="/results" className={itemClass("/results")}>
          <GraduationCap size={20} />
          Results
        </Link>

        <p className="text-gray-400 uppercase text-sm mt-6">Add-ons</p>
        <Link to="/attendance" className={itemClass("/attendance")}>
          <UserCheck size={20} />
          Attendance
        </Link>
        <Link to="/library" className={itemClass("/library")}>
          <BookOpen size={20} />
          Library
        </Link>
        <Link to="/teacher/fees" className={itemClass("/teacher/fees")}>
          <IndianRupee size={20} />
          Fee Management
        </Link>
        <Link
          to="/teacher/study-material"
          className={itemClass("/teacher/study-material")}
        >
          <FileText size={20} />
          Study Material
        </Link>

        {/* 🔥 NEW PLACEMENT CELL OPTION */}
        <Link
          to="/placement"
          className={itemClass("/placement")}
        >
          <Briefcase size={20} />
          Placement Cell
        </Link>

        <Link to="/teacher/inbox" className={itemClass("/teacher/inbox")}>
          <MessageSquare size={20} />
          Inbox
        </Link>

      </div>
    </div>
  );
};

export default Sidebar;