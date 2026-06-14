// src/components/StudentAttendanceChart.jsx
const StudentAttendanceChart = () => {
  const data = [70, 85, 90, 60, 80, 75]; // Example weekly attendance %

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
      <h3 className="text-lg font-semibold mb-4">My Attendance</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map((val, idx) => (
          <div
            key={idx}
            style={{ height: `${val}%` }}
            className="w-6 bg-blue-500 rounded hover:bg-blue-600 transition"
            title={`${val}%`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
    </div>
  );
};

export default StudentAttendanceChart;
