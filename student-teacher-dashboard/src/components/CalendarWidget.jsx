// src/components/CalendarWidget.jsx
const CalendarWidget = () => {
  const events = [
    { title: "React Assignment Due", date: "2025-11-20" },
    { title: "Mid Term Exam", date: "2025-11-01" },
    { title: "JS Basics Quiz", date: "2025-10-30" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border">
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-200">
        {events.map((event, idx) => (
          <li key={idx} className="flex justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <span>{event.title}</span>
            <span className="text-gray-500">{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarWidget;
