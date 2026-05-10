"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  async function loadTasks() {
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error();
      setTasks(await res.json());
      setError("");
    } catch {
      setError("Could not load tasks. Check backend and DB are running.");
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), description: newDesc.trim() }),
    });
    setNewTitle("");
    setNewDesc("");
    loadTasks();
  }

  async function toggleComplete(task: Task) {
    await fetch(`${API}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    loadTasks();
  }

  async function deleteTask(id: number) {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  function startEdit(task: Task) {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
  }

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTitle.trim()) return;
    await fetch(`${API}/tasks/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle.trim(), description: editDesc.trim() }),
    });
    setEditId(null);
    loadTasks();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Task Manager</h1>

        {/* Add task form */}
        <form onSubmit={addTask} className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col gap-3">
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
          >
            Add Task
          </button>
        </form>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Task list */}
        {!error && tasks.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No tasks yet. Add one above.</p>
        )}

        <ul className="flex flex-col gap-3">
          {tasks.map((task) =>
            editId === task.id ? (
              <li key={task.id} className="bg-white rounded-xl shadow p-4">
                <form onSubmit={saveEdit} className="flex flex-col gap-2">
                  <input
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg px-4 py-1.5 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="text-gray-500 hover:text-gray-700 text-sm px-4 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li
                key={task.id}
                className="bg-white rounded-xl shadow p-4 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  className="mt-1 h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      task.completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-600 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
