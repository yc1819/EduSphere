// src/storage/messagesStorage.js

const KEY = "messages_records";

/* -----------------------------
   GET ALL MESSAGES
------------------------------ */
export const getMessages = () => {
  const data = localStorage.getItem(KEY);
  try {
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/* -----------------------------
   SAVE ALL MESSAGES
------------------------------ */
export const saveMessages = (messages) => {
  if (!Array.isArray(messages)) return;
  localStorage.setItem(KEY, JSON.stringify(messages));
};

/* -----------------------------
   ADD NEW MESSAGE
   teacher → student
   teacher → all
------------------------------ */
export const addMessage = (message) => {
  const messages = getMessages();

  const newMessage = {
    id: Date.now(),
    sender: message.sender || "teacher",
    recipient: message.recipient,     // student roll OR "all"
    title: message.title,
    body: message.body,
    read: false,
    date: new Date().toISOString(),
  };

  messages.push(newMessage);
  saveMessages(messages);

  return newMessage;
};

/* -----------------------------
   MARK A MESSAGE AS READ
------------------------------ */
export const markMessageRead = (id) => {
  const messages = getMessages();
  const updated = messages.map((m) =>
    m.id === id ? { ...m, read: true } : m
  );
  saveMessages(updated);
};

/* -----------------------------
   GET STUDENT MESSAGES
   student sees → direct messages + "all"
------------------------------ */
export const getStudentMessages = (roll) => {
  const messages = getMessages();
  return messages.filter(
    (m) => m.recipient === roll || m.recipient === "all"
  );
};

/* -----------------------------
   GET TEACHER INBOX
   teacher sees → all messages they sent
------------------------------ */
export const getTeacherMessages = () => {
  const messages = getMessages();
  return messages.filter((m) => m.sender === "teacher");
};

