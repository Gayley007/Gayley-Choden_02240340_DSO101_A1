"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");

  const hasTasks = useMemo(() => tasks.length > 0, [tasks]);

  async function fetchTasks() {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch {
      setError("Could not load tasks. Check backend and DB are running.");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function createTask(event) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch {
      setError("Could not create task.");
    }
  }

  async function updateTask(id, payload) {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await fetchTasks();
    } catch {
      setError("Could not update task.");
    }
  }

  async function deleteTask(id) {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      fetchTasks();
    } catch {
      setError("Could not delete task.");
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) {
      return;
    }
    await updateTask(id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    cancelEdit();
  }

  return (
    <main className="container">
      <h1>Task Manager</h1>

      <form className="task-form" onSubmit={createTask}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          required
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description (optional)"
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      {!hasTasks ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              {editingId === task.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                  <input
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                  />
                  <div className="actions">
                    <button onClick={() => saveEdit(task.id)}>Save</button>
                    <button className="secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-content">
                    <h3 className={task.completed ? "done" : ""}>
                      {task.title}
                    </h3>
                    <p>{task.description || "No description"}</p>
                  </div>
                  <div className="actions">
                    <button
                      onClick={() =>
                        updateTask(task.id, { completed: !task.completed })
                      }
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button
                      className="secondary"
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
