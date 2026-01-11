import express from "express";
import cors from "cors";
import db from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    const result = tasks.map((task: any) => ({
        ...task,
        done: task.done === 1,
    }));
    res.json(result);
});

app.post("/api/tasks", (req, res) => {
    const { title } = req.body;
    const result = db.prepare("INSERT INTO tasks (title) VALUES (?)").run(title);
    res.json({ id: result.lastInsertRowid, title, done: false });
});

app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    res.json({ success: true });
});

app.patch("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    db.prepare("UPDATE tasks SET done = ? WHERE id = ?").run(done ? 1 : 0, id);
    res.json({ success: true });
});

app.listen(3001, () => {
    console.log("Server: http://localhost:3001");
});
