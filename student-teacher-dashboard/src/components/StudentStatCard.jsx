// src/components/StudentStatCard.jsx
const StudentStatCard = ({ title, percent, color, icon }) => {
  return (
    <div
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow border"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{percent}</p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
};

export default StudentStatCard;
