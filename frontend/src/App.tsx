//імпортуємо реакт хуки для зберігання даних (useState) та виконування коду при завантаженні/зміні (useEffect)
import { useEffect, useState } from "react";
//HTTP-клиент Axios для запросів на бекенд
import api from "./api/axios";
//імпорт з інших файлів проекту (типи та компоненти)
import type { Todo } from "./types/todo";
import TodoForm from "./components/TodoForm";
//імпорт компонентів Material UI (бібліотека компонентів для React)
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
//імпорт файла з версткою
import "./styles/app.scss";

function App() {
  //СТАНИ
  const [todos, setTodos] = useState<Todo[]>([]); //список задач
  const [categories, setCategories] = useState<string[]>([]); //список категорій
  const [selectedCategory, setSelectedCategory] = useState("All"); //обраний фільтр (за замовчуванням - всі категорії)
  const [loading, setLoading] = useState(false);//завантаження
  const [error, setError] = useState(""); //помилки

  //SNACKBAR
  const [snackbarOpen, setSnackbarOpen] = useState(false);//керування снекбаром
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [undoAction, setUndoAction] = useState<null | (() => void)>(null); //для відміни дії

  //ВІДКЛАДЕНІ ДІЇ
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    timer: any;
  } | null>(null); //зберігання таски, яка скоро видалеться

  const [pendingComplete, setPendingComplete] = useState<{
    id: number;
    timer: any;
  } | null>(null);//зберігання таски, яка скоро стане виконається

  //FETCH TODOS
  //функція, яка завантажує задачі
  const fetchTodos = async () => {
    try {
      setLoading(true);//показуємо завантаження
      const url =
        selectedCategory === "All"
          ? "/todos"
          : `/todos?category=${selectedCategory}`; //показуємо всі таски, але якщо обрана категорія, показуємо лише її таски
      const response = await api.get(url); //отримуємо відповідь з бекенда
      setTodos(response.data);
    } catch (err) {
      setError("Failed to load todos");//перевірка на помилки
    } finally {
      setLoading(false);//ховаємо завантаження
    }
  };

  //FETCH CATEGORIES
  //функція, яка завантажує категорії з бекенда
  const fetchCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  //SNACKBAR HELPER - керування снекбаром
  const showSnackbar = (message: string, undo?: () => void) => {
    setSnackbarMessage(message);
    setUndoAction(() => undo || null);
    setSnackbarOpen(true);
  };

  //DELETE
  const handleDelete = (todo: Todo) => {
    const id = todo.id;
    const timer = setTimeout(async () => {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    }, 5000);
    setPendingDelete({ id, timer });
    showSnackbar("Task will be deleted", () => {
      clearTimeout(timer);
      setPendingDelete(null);
    });
  };

  //COMPLETE TOGGLE - позначення таски, як виконаної (0 - виконано, 1 - не виконано, функція змінює стан на протилежний)
  const handleToggleComplete = (todo: Todo) => {
    const newValue = todo.completed ? 0 : 1;
    const timer = setTimeout(async () => {
      await api.patch(`/todos/${todo.id}`, { completed: newValue });
      fetchTodos();
    }, 5000);
    setPendingComplete({ id: todo.id, timer });
    showSnackbar("Status will be updated", () => {
      clearTimeout(timer);
      setPendingComplete(null);
    });
  };

  //USE EFFECTS - оновлення стану при зміні категорії
  useEffect(() => {
    fetchTodos();
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []); //для першого запуска (завантажуємо всі категорії)

  //для екрану завантаження
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  //ОСНОВНИЙ РЕНДЕР
  return (
    <div className="app">

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">My Tasks</h1>
          <p className="app-header__meta">
            {todos.filter(t => !t.completed).length} remaining · {todos.filter(t => t.completed).length} done
          </p>
        </div>
      </header>

      <div className="app-body">

        {error && (
          <div className="error-banner">⚠ {error}</div>
        )}

        {/* ── FILTER ── */}
        <div className="filter-row">
          <span className="filter-row__label">Filter:</span>
          {/* ── створюємо кнопки фільтра ── */}
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              className={`filter-chip${selectedCategory === cat ? " filter-chip--active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── FORM ── */}
        <div className="todo-form-wrap">
          <p className="todo-form-wrap__title">Add new task</p>
          <TodoForm categories={categories} onTodoCreated={fetchTodos} />
        </div>

        {/* ── LIST ── */}
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="todo-list__empty">No tasks yet.</div>
          ) : (
            todos.map((todo) => {
              const isPendingDelete = pendingDelete?.id === todo.id;
              return (
                <div
                  key={todo.id}
                  className={`todo-card${isPendingDelete ? " todo-card--pending-delete" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={Boolean(todo.completed)}
                    onChange={() => handleToggleComplete(todo)}
                  />

                  <div className="todo-card__body">
                    <p className={`todo-card__text${todo.completed ? " todo-card__text--done" : ""}`}>
                      {todo.text}
                    </p>
                    <span className="todo-card__category">{todo.category}</span>
                  </div>

                  <span className={`todo-card__status${todo.completed ? " todo-card__status--done" : ""}`}>
                    {todo.completed ? "Done" : "Active"}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(todo)}
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── SNACKBAR ── */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="info"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            background: "#fff",
            color: "#2c2417",
            border: "1.5px solid #e8e3dc",
            borderRadius: "12px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": { color: "#b07d4a" },
          }}
          action={
            undoAction ? (
              <Button
                size="small"
                onClick={() => {
                  undoAction();
                  setSnackbarOpen(false);
                }}
                sx={{
                  color: "#b07d4a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: "none",
                  border: "1.5px solid #e8d5c0",
                  borderRadius: "8px",
                  padding: "3px 12px",
                  minWidth: "auto",
                  "&:hover": { background: "#fdf4ec", borderColor: "#b07d4a" },
                }}
              >
                Undo
              </Button>
            ) : null
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
