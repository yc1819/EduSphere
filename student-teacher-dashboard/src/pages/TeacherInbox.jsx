import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";

import { getStudents } from "../storage/studentsStorage";
import { getTeacherMessages, addMessage } from "../storage/messagesStorage";

const TeacherInbox = () => {
  const students = getStudents();
  const [messages, setMessages] = useState([]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipient, setRecipient] = useState("all");

  const [selectedMessage, setSelectedMessage] = useState(null);

  // Load messages
  useEffect(() => {
    const data = getTeacherMessages();
    setMessages(data);

    if (data.length > 0) {
      setSelectedMessage(data[0]); // auto select first
    }
  }, []);

  const handleSend = () => {
    if (!title || !body) return;

    addMessage({
      sender: "teacher",
      recipient,
      title,
      body,
    });

    const updated = getTeacherMessages();
    setMessages(updated);

    if (updated.length > 0) {
      setSelectedMessage(updated[0]);
    }

    setTitle("");
    setBody("");
  };

  const getRecipientName = (r) => {
    if (r === "all") return "All Students";
    const stu = students.find((s) => s.roll === r);
    return stu ? stu.name + " (" + stu.roll + ")" : r;
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Communication</h1>

          {/* SEND MESSAGE FORM */}
          <div className="bg-white p-4 rounded-xl shadow border mb-4">
            <h2 className="text-lg font-semibold mb-3">Send Message</h2>

            <div className="space-y-2">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <textarea
                placeholder="Message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="border p-2 w-full rounded"
                rows={3}
              />

              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="border p-2 w-full rounded"
              >
                <option value="all">All Students</option>
                {students.map((s) => (
                  <option key={s.roll} value={s.roll}>
                    {s.name} ({s.roll})
                  </option>
                ))}
              </select>

              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>

          {/* SPLIT VIEW */}
          <div className="flex gap-4">
            
            {/* LEFT PANEL - MESSAGE LIST */}
            <div className="w-1/3 bg-white rounded-xl shadow border overflow-y-auto max-h-[70vh]">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 p-6">
                  No messages sent
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMessage(m)}
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
                    </div>

                    <p className="text-sm text-gray-500 truncate mt-1">
                      To: {getRecipientName(m.recipient)}
                    </p>

                    <small className="text-xs text-gray-400">
                      {new Date(m.date).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT PANEL - MESSAGE DETAIL */}
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

                  <p className="text-sm text-gray-500 mt-2">
                    To: {getRecipientName(selectedMessage.recipient)}
                  </p>

                  <hr className="my-4" />

                  <p className="text-gray-700 leading-relaxed">
                    {selectedMessage.body}
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherInbox;