// utils/api.js

export const getNotes = async () => {
  const res = await fetch("/api/notes", {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
};

export const saveNote = async (id, { title, content }) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    throw new Error("Failed to save note");
  }
  return res.json();
};

export const createNote = async (note) => {
  const res = await fetch(`/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    throw new Error("Failed to create note");
  }
  return res.json();
};

export const deleteNote = async (id) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to delete note");
  }
  return res.json();
};
