import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import { getStudentMessages, markMessageRead } from "../storage/messagesStorage";

const StudentInbox = () => {
  const [messages, setMessages] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load student ID
  useEffect(() => {
    const id = localStorage.getItem("currentStudentId");
    setStudentId(id);
  }, []);

  // Load messages
  useEffect(() => {
    if (studentId) {
      const data = getStudentMessages(studentId) || [];
      setMessages(data);

      if (data.length > 0) {
        setSelectedMessage(data[0]); // auto select first
      }
    }
  }, [studentId]);

  const handleSelect = (msg) => {
    setSelectedMessage(msg);

    if (!msg.read) {
      markMessageRead(msg.id);
      const updated = getStudentMessages(studentId);
      setMessages(updated);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <StudentSidebar />

      <div className="flex-1">
        <StudentTopbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Communication</h1>

          {!studentId ? (
            <p className="text-center text-gray-500 mt-10">
              No student logged in
            </p>
          ) : (
            <div className="flex gap-4">
              
              {/* LEFT PANEL */}
              <div className="w-1/3 bg-white rounded-xl shadow border overflow-y-auto max-h-[75vh]">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 p-6">
                    No messages
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleSelect(m)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedMessage?.id === m.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">
                          {m.title}
                        </h3>

                        {!m.read && (
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 truncate mt-1">
                        {m.body}
                      </p>

                      <small className="text-xs text-gray-400">
                        {new Date(m.date).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                )}
              </div>

              {/* RIGHT PANEL */}
              <div className="flex-1 bg-white rounded-xl shadow border p-6">
                {!selectedMessage ? (
                  <p className="text-gray-500 text-center mt-20">
                    Select a message
                  </p>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">
                        {selectedMessage.title}
                      </h2>

                      <span className="text-sm text-gray-400">
                        {new Date(selectedMessage.date).toLocaleString()}
                      </span>
                    </div>

                    <hr className="my-4" />

                    <p className="text-gray-700 leading-relaxed">
                      {selectedMessage.body}
                    </p>
                  </>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInbox;