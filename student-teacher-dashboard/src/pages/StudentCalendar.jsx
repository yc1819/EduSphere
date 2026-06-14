// src/pages/StudentCalendar.jsx
import { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";

// Dummy events (replace with real teacher events from storage/backend)
const events = [
  { title: "Testing", date: 19, month: 8, year: 2025, color: "blue", hour: 10, minute: 0 },
  { title: "Mobile App VIVA", date: 22, month: 10, year: 2025, color: "green", hour: 14, minute: 30 },
  { title: "Test", date: 12, month: 10, year: 2025, color: "red", hour: 9, minute: 0 },
];

// Helper
const getToday = () => new Date().getDate();

const StudentCalendar = () => {
  const [view, setView] = useState("month");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDate = getToday();
  const currentMonthName = new Date(currentYear, currentMonthIndex).toLocaleString("en-US", { month: "long" });

  // Month calculations
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay();
  const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => ({
    date: new Date(currentYear, currentMonthIndex, -i).getDate(),
    isCurrentMonth: false,
  })).reverse();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({ date: i + 1, isCurrentMonth: true }));
  const nextMonthDays = Array.from({ length: 42 - (prevMonthDays.length + currentMonthDays.length) }, (_, i) => ({
    date: i + 1,
    isCurrentMonth: false,
  }));
  const dates = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const changeMonth = (type) => {
    if (type === "prev") {
      let month = currentMonthIndex - 1;
      let year = currentYear;
      if (month < 0) { month = 11; year--; }
      setCurrentMonthIndex(month); setCurrentYear(year);
    } else {
      let month = currentMonthIndex + 1;
      let year = currentYear;
      if (month > 11) { month = 0; year++; }
      setCurrentMonthIndex(month); setCurrentYear(year);
    }
  };

  // --- Month View ---
  const renderMonthView = () => (
    <>
      <div className="grid grid-cols-7 text-center font-semibold pb-2 border-b">
        {days.map(d => <div key={d} className="text-gray-700 py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 border-t border-l">
        {dates.map((item, index) => {
          const isToday = item.isCurrentMonth && item.date === todayDate && currentMonthIndex === new Date().getMonth();
          const dayEvents = events.filter(e => e.date === item.date && e.month === currentMonthIndex && e.year === currentYear);

          let dateClass = "h-24 border-r border-b flex flex-col items-start justify-start p-2";
          if (!item.isCurrentMonth) dateClass += " bg-gray-50 text-gray-400"; else dateClass += " bg-white";
          if (isToday) dateClass += " bg-red-50 text-red-700 font-bold";

          return (
            <div key={index} className={dateClass}>
              <span className="font-medium">{item.date}</span>
              {dayEvents.map((ev, i) => (
                <div
                  key={i}
                  className={`text-xs px-1 rounded mt-1 truncate text-white ${ev.color === "blue" ? "bg-blue-500" : ev.color === "green" ? "bg-green-500" : ev.color === "red" ? "bg-red-500" : "bg-yellow-500"}`}
                >
                  {ev.title} {ev.hour !== "" ? `@${ev.hour}:${ev.minute.toString().padStart(2,"0")}` : ""}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );

  // --- Week View ---
  const renderWeekView = () => {
    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - 3 + i);
      return { date: d.getDate(), month: d.getMonth(), year: d.getFullYear(), day: days[d.getDay()] };
    });

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am - 7pm

    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 border-t border-l relative">
          <div className="border-r text-sm font-semibold text-gray-700 py-2 pl-2">Time</div>
          {weekDates.map((d, i) => <div key={i} className="border-r text-center font-semibold py-2">{d.day} {d.date}</div>)}

          {hours.map((hour, i) => (
            <>
              <div key={`time-${i}`} className="border-r border-b h-16 text-right pr-2 text-xs text-gray-500 flex items-start justify-end pt-1">
                {hour > 12 ? `${hour-12}pm` : `${hour}am`}
              </div>
              {weekDates.map((d, j) => {
                const dayEvent = events.find(ev => ev.date === d.date && ev.month === d.month && ev.year === d.year && ev.hour === hour);
                return (
                  <div key={j} className="border-r border-b h-16 relative">
                    {dayEvent && (
                      <div className={`absolute left-0 right-0 top-1 bg-${dayEvent.color}-500 text-white text-xs p-1 rounded text-center`}>
                        {dayEvent.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    );
  };

  // --- Day View ---
  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
    const today = new Date();
    return (
      <div className="overflow-y-auto h-[60vh]">
        <div className="text-center font-semibold py-2">
          {days[today.getDay()]}, {today.getDate()}/{today.getMonth()+1}/{today.getFullYear()}
        </div>
        <div className="grid grid-cols-2 border-t border-l">
          {hours.map((hour, i) => (
            <>
              <div key={`time-${i}`} className="border-r border-b h-16 text-right pr-2 text-xs text-gray-500 flex items-start justify-end pt-1">
                {hour > 12 ? `${hour-12}pm` : `${hour}am`}
              </div>
              <div key={`event-${i}`} className="border-r border-b h-16 relative">
                {events.filter(ev => ev.date === today.getDate() && ev.month === today.getMonth() && ev.year === today.getFullYear() && ev.hour === hour)
                  .map((ev, idx) => (
                  <div key={idx} className={`absolute left-0 right-0 top-1 bg-${ev.color}-500 text-white text-xs p-1 rounded text-center`}>
                    {ev.title}
                  </div>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
    );
  };

  // --- List View ---
  const renderListView = () => (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">{currentMonthName} {currentYear}</h3>
      {events.filter(ev => ev.month === currentMonthIndex && ev.year === currentYear)
        .sort((a,b) => a.date - b.date)
        .map((ev, i) => (
        <div key={i} className="mb-3 p-2 border-l-4 border-blue-500 bg-blue-100 rounded">
          <p className="font-medium">{ev.title}</p>
          <p className="text-sm text-blue-700">{ev.date}/{ev.month+1}/{ev.year} {ev.hour !== "" ? `${ev.hour}:${ev.minute.toString().padStart(2,"0")}` : "All-day"}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <StudentSidebar />
      <div className="flex-1 p-6">
        <StudentTopbar />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{currentMonthName} {currentYear}</h2>
          <div className="flex space-x-2">
            <button onClick={() => changeMonth("prev")} className="px-3 py-1 bg-white border rounded hover:bg-gray-100">&lt;</button>
            <button onClick={() => changeMonth("next")} className="px-3 py-1 bg-white border rounded hover:bg-gray-100">&gt;</button>
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1 bg-white rounded-xl shadow border">
            {view === "month" && renderMonthView()}
            {view === "week" && renderWeekView()}
            {view === "day" && renderDayView()}
            {view === "list" && renderListView()}
          </div>

          <div className="w-64 bg-white p-4 rounded-xl shadow border h-fit">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Events</h3>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="cursor-default p-2 rounded">
                  <p className="text-sm font-semibold truncate">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {event.date}/{event.month+1}/{event.year} {event.hour !== "" ? `${event.hour}:${event.minute.toString().padStart(2,"0")}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex border border-gray-300 rounded overflow-hidden mt-4">
          <button className={`py-2 px-4 text-sm font-medium ${view==='month'?'bg-blue-500 text-white':'bg-white text-gray-700 hover:bg-gray-100'}`} onClick={()=>setView('month')}>Month</button>
          <button className={`py-2 px-4 text-sm font-medium border-l border-r ${view==='week'?'bg-blue-500 text-white':'bg-white text-gray-700 hover:bg-gray-100'}`} onClick={()=>setView('week')}>Week</button>
          <button className={`py-2 px-4 text-sm font-medium border-r ${view==='day'?'bg-blue-500 text-white':'bg-white text-gray-700 hover:bg-gray-100'}`} onClick={()=>setView('day')}>Day</button>
          <button className={`py-2 px-4 text-sm font-medium ${view==='list'?'bg-blue-500 text-white':'bg-white text-gray-700 hover:bg-gray-100'}`} onClick={()=>setView('list')}>List</button>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;

