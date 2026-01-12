import express from "express";
import cors from "cors";
import db from "./db";
import {
    hashPassword,
    comparePassword,
    createToken,
    authMiddleware,
} from "./auth";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Введите логин и пароль" });
    }

    const existing = db
        .prepare("SELECT id FROM users WHERE username = ?")
        .get(username);
    if (existing) {
        return res.status(400).json({ error: "Пользователь уже существует" });
    }

    const hashedPassword = hashPassword(password);
    const result = db
        .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
        .run(username, hashedPassword);

    const token = createToken(result.lastInsertRowid as number);
    res.json({ token, username });
});

app.post("/api/signin", (req, res) => {
    const { username, password } = req.body;

    const user = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username) as any;
    if (!user) {
        return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    if (!comparePassword(password, user.password)) {
        return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const token = createToken(user.id);
    res.json({ token, username });
});

app.get("/api/tasks", authMiddleware, (req, res) => {
    const userId = (req as any).userId;
    const tasks = db
        .prepare("SELECT * FROM tasks WHERE user_id = ?")
        .all(userId);
    const result = tasks.map((task: any) => ({
        ...task,
        done: task.done === 1,
    }));
    res.json(result);
});

app.post("/api/tasks", authMiddleware, (req, res) => {
    const userId = (req as any).userId;
    const { title, deadline, priority, category } = req.body;
    const result = db
        .prepare(
            "INSERT INTO tasks (title, deadline, priority, category, user_id) VALUES (?, ?, ?, ?, ?)"
        )
        .run(
            title,
            deadline || null,
            priority || "medium",
            category || null,
            userId
        );
    res.json({
        id: result.lastInsertRowid,
        title,
        done: false,
        deadline: deadline || null,
        priority: priority || "medium",
        category: category || null,
    });
});

app.delete("/api/tasks/:id", authMiddleware, (req, res) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(
        id,
        userId
    );
    res.json({ success: true });
});

app.patch("/api/tasks/:id", authMiddleware, (req, res) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { done, title, deadline, priority, category } = req.body;

    // Проверяем что задача принадлежит пользователю
    const task = db
        .prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?")
        .get(id, userId);
    if (!task) {
        return res.status(404).json({ error: "Задача не найдена" });
    }

    if (title !== undefined) {
        db.prepare("UPDATE tasks SET title = ? WHERE id = ?").run(title, id);
    }
    if (done !== undefined) {
        db.prepare("UPDATE tasks SET done = ? WHERE id = ?").run(
            done ? 1 : 0,
            id
        );
    }
    if (deadline !== undefined) {
        db.prepare("UPDATE tasks SET deadline = ? WHERE id = ?").run(
            deadline,
            id
        );
    }
    if (priority !== undefined) {
        db.prepare("UPDATE tasks SET priority = ? WHERE id = ?").run(
            priority,
            id
        );
    }
    if (category !== undefined) {
        db.prepare("UPDATE tasks SET category = ? WHERE id = ?").run(
            category,
            id
        );
    }

    res.json({ success: true });
});

app.listen(3001, () => {
    console.log("Server: http://localhost:3001");
});
