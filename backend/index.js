//під'єднуємо бібліотеки та базу даних
const express = require("express");
const cors = require("cors");
const db = require("./db");

//створюємо додаток
const app = express();

//під'єднуємо middleware
app.use(cors());
app.use(express.json());

//створюємо масив можливих категорій для тасок
const categories = ["Work", "Study", "Personal"];

//обробка категорій
app.get("/categories", (req, res) => {
res.json(categories);
});


//обробка категорій
app.get("/todos", (req, res) => {
const { category } = req.query;

if (category && category !== "All") {
const todos = db
.prepare("SELECT * FROM todos WHERE category = ?")
.all(category);

return res.json(todos);

}

const todos = db.prepare("SELECT * FROM todos").all();

res.json(todos);
});


//створення таски
app.post("/todos", (req, res) => {
const { text, category } = req.body;

if (!text || !category) {
return res.status(400).json({
message: "All fields are required"
});
}

const count = db
.prepare(
"SELECT COUNT(*) as count FROM todos WHERE category = ?"
)
.get(category);

//перевірка кількості тасків в категорії
if (count.count >= 5) {
return res.status(400).json({
message: "Maximum 5 tasks per category"
});
}

//запис тасок в базу даних
const result = db
.prepare(
"INSERT INTO todos (text, category) VALUES (?, ?)"
)
.run(text, category);

//отримання таски з бази даних
const todo = db
.prepare("SELECT * FROM todos WHERE id = ?")
.get(result.lastInsertRowid);

res.status(201).json(todo);
});

app.patch("/todos/:id", (req, res) => {
const { completed } = req.body;

db.prepare(
"UPDATE todos SET completed = ? WHERE id = ?"
).run(completed ? 1 : 0, req.params.id);

res.json({
success: true
});
});

//видалення тасок з бази даних
app.delete("/todos/:id", (req, res) => {
db.prepare("DELETE FROM todos WHERE id = ?")
.run(req.params.id);

res.json({
success: true
});
});

//запуск сервера
app.listen(3000, () => {
console.log("Server running on port 3000");
});
