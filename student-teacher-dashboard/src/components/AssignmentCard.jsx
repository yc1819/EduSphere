const AssignmentCard = ({ title, dueDate, teacher, file, onView }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500 mb-1">Due: {dueDate}</p>
        {teacher && <p className="text-gray-600 mb-1">Teacher: {teacher}</p>}
        {file && <p className="text-sm text-gray-500">File uploaded</p>}
      </div>
      <button
        onClick={onView}
        className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View
      </button>
    </div>
  );
};

export default AssignmentCard;
