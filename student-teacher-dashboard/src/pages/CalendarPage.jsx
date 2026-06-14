import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState } from 'react';

const getToday = () => new Date().getDate();

const EventModal = ({ open, onClose, onSave, onDelete, eventData, selectedDate }) => {
  const [form, setForm] = useState({
    title: eventData?.title || "",
    color: eventData?.color || "blue",
    hour: eventData?.hour || "",
    minute: eventData?.minute || "",
  });

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveEvent = () => {
    onSave({ ...form, date: selectedDate.date, month: selectedDate.month, year: selectedDate.year });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl w-96 shadow-2xl border">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {eventData ? "Edit Event" : "Add Event"}
        </h2>

        <input
          type="text"
          name="title"
          className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
        />

        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium">Color Category</label>
          <select
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="yellow">Yellow</option>
          </select>
        </div>

        <div className="mb-3 flex space-x-2">
          <input
            type="number"
            name="hour"
            min={0}
            max={23}
            value={form.hour}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
            placeholder="Hour"
          />
          <input
            type="number"
            name="minute"
            min={0}
            max={59}
            value={form.minute}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
            placeholder="Minute"
          />
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          {eventData && (
            <button onClick={() => onDelete(eventData)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
              Delete
            </button>
          )}
          <button onClick={saveEvent} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save
          </button>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [view, setView] = useState('month');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([
    { title: "Testing", date: 19, month: 8, year: 2025, color: "blue", hour: 10, minute: 0 },
    { title: "Mobile App VIVA", date: 22, month: 10, year: 2025, color: "green", hour: 14, minute: 30 },
    { title: "Test", date: 12, month: 10, year: 2025, color: "red", hour: 9, minute: 0 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const todayDate = getToday();
  const currentMonthName = new Date(currentYear, currentMonthIndex).toLocaleString("en-US",{month:"long"});

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay();

  const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => ({
    date: new Date(currentYear, currentMonthIndex, -i).getDate(),
    isCurrentMonth: false
  })).reverse();

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    isCurrentMonth: true
  }));

  const nextMonthDays = Array.from({
    length: 42 - (prevMonthDays.length + currentMonthDays.length)
  }, (_, i) => ({
    date: i + 1,
    isCurrentMonth: false
  }));

  const dates = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const openAddModal = (dateInfo) => {
    setSelectedDate(dateInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setSelectedDate({ date: event.date, month: event.month, year: event.year });
    setModalOpen(true);
  };

  const saveEvent = (data) => {
    if (selectedEvent) {
      setEvents(prev => prev.map(ev => ev === selectedEvent ? data : ev));
    } else {
      setEvents(prev => [...prev, data]);
    }
    setModalOpen(false);
  };

  const deleteEvent = (event) => {
    setEvents(prev => prev.filter(ev => ev !== event));
    setModalOpen(false);
  };

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

  const renderMonthView = () => (
    <>
      <div className="grid grid-cols-7 text-center font-semibold pb-2 border-b bg-gray-50">
        {days.map(d => <div key={d} className="py-2 text-gray-600">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 border-t border-l">
        {dates.map((item,index)=>{
          const isToday = item.isCurrentMonth && item.date===todayDate && currentMonthIndex===new Date().getMonth();
          const dayEvents = events.filter(e=>e.date===item.date && e.month===currentMonthIndex && e.year===currentYear);

          let dateClass = "h-24 border-r border-b flex flex-col p-2 cursor-pointer transition";
          if(!item.isCurrentMonth) dateClass+=" bg-gray-50 text-gray-400";
          else dateClass+=" hover:bg-gray-100";
          if(isToday) dateClass+=" bg-red-50 text-red-600 font-bold";

          return(
            <div key={index} className={dateClass} onClick={()=>item.isCurrentMonth && openAddModal({date:item.date,month:currentMonthIndex,year:currentYear})}>
              <span>{item.date}</span>

              {dayEvents.map((ev,i)=>(
                <div key={i}
                  className={`text-xs px-1 rounded mt-1 truncate text-white ${
                    ev.color==="blue"?"bg-blue-500":
                    ev.color==="green"?"bg-green-500":
                    ev.color==="red"?"bg-red-500":"bg-yellow-500"
                  }`}
                  onClick={(e)=>{e.stopPropagation();openEditModal(ev);}}
                >
                  {ev.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <div className="p-8 flex space-x-6">

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">

              <div className="flex items-center space-x-2">
                <button className="bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100">
                  Today
                </button>

                <div className="flex border rounded-lg overflow-hidden shadow">
                  <button onClick={()=>changeMonth("prev")} className="px-3 py-2 hover:bg-gray-100">&lt;</button>
                  <button onClick={()=>changeMonth("next")} className="px-3 py-2 hover:bg-gray-100">&gt;</button>
                </div>

                <h2 className="text-2xl font-bold">{currentMonthName} {currentYear}</h2>
              </div>

              <div className="flex border rounded-lg overflow-hidden">
                {["month","week","day","list"].map(v=>(
                  <button
                    key={v}
                    onClick={()=>setView(v)}
                    className={`px-4 py-2 text-sm ${
                      view===v
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border">
              {view==="month" && renderMonthView()}
            </div>
          </div>

          <div className="w-64 bg-white/80 backdrop-blur p-4 rounded-2xl shadow-lg border">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Events</h3>

            {events.map((event,index)=>(
              <div key={index}
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                onClick={()=>openEditModal(event)}
              >
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {event.date}/{event.month+1}/{event.year}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>

      <EventModal
        open={modalOpen}
        onClose={()=>setModalOpen(false)}
        onSave={saveEvent}
        onDelete={deleteEvent}
        eventData={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;