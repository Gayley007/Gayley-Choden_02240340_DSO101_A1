const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = require("./db");

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "db_error" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.get("/api/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description = "", completed = false } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
      [String(title).trim(), String(description).trim(), Boolean(completed)],
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const current = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      req.params.id,
    ]);
    if (current.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const old = current.rows[0];
    const title =
      req.body.title !== undefined ? String(req.body.title).trim() : old.title;
    const description =
      req.body.description !== undefined
        ? String(req.body.description).trim()
        : old.description;
    const completed =
      req.body.completed !== undefined
        ? Boolean(req.body.completed)
        : old.completed;

    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, completed = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [title, description, completed, req.params.id],
    );

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
