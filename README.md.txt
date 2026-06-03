# Todo App

Small full-stack Todo application built as a test task.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Axios
* React Hook Form
* MUI Snackbar

### Backend

* Node.js
* Express.js
* SQLite
* better-sqlite3

---

# Features

* Create tasks with categories
* Filter tasks by category
* Mark tasks as completed
* Delete tasks
* Undo delete / complete actions with Snackbar
* Maximum 5 tasks per category
* Loading state
* Error handling
* Empty state UI

---

# Project Structure

```txt
frontend/
backend/
```

---

# Backend API

## GET /todos

Get all todos or filter by category.

Example:

```txt
/todos?category=Work
```

---

## POST /todos

Create new todo.

Request body:

```json
{
  "text": "Learn React",
  "category": "Study"
}
```

---

## PATCH /todos/:id

Update completed status.

Request body:

```json
{
  "completed": true
}
```

---

## DELETE /todos/:id

Delete todo.

---

## GET /categories

Get available categories.

---

# Business Rules

* Each category can contain maximum 5 tasks
* If limit exceeded → backend returns 400 error
* Undo action is available for 5 seconds

---

# How To Run

## 1. Clone repository

```bash
git clone YOUR_REPOSITORY_LINK
```

---

# Backend

```bash
cd backend
npm install
npm start
```

Server runs on:

```txt
http://localhost:3000
```

---

# Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```
