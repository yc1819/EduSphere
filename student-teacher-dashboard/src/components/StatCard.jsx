const StatCard = ({ title, color, icon, percent }) => {
  return (
    <div
      className={`p-5 border rounded-xl shadow bg-white flex-1`}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <p className="text-xl font-bold mt-3">{percent}%</p>
      <div className="h-2 rounded bg-gray-200 mt-3">
        <div
          className="h-2 rounded"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
