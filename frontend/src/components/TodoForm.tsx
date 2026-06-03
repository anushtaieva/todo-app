import { useForm } from "react-hook-form";
import api from "../api/axios";

//налаштовуємо вхідні параметри
interface Props {
  categories: string[];
  onTodoCreated: () => void;
}

//налаштовуємо структуру даних форми
interface FormData {
  text: string;
  category: string;
}

//створюємо компонент, саму форму
function TodoForm({ categories, onTodoCreated }: Props) {
  const {
    register, //під'єднання інпутів та селектів до форми
    handleSubmit, //валідація
    reset, //очищення форми перд відправкою
    formState: { errors }, //валідація помилок
  } = useForm<FormData>();

  //надсилаємо форму на бекенд з введеними даними 
  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/todos", data);
      reset();
      onTodoCreated();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create task");
    }
  };

  //розмітка форми, як ми її бачимо на екрані
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="todo-form">

      <div className="todo-form__row">

        <div className="todo-form-field todo-form-field--grow">
          <label className="todo-form-label">Task</label>
          <input
            className={`todo-form-input${errors.text ? " todo-form-input--error" : ""}`}
            placeholder="What needs to be done?"
            {...register("text", { required: true })}
          />
          {errors.text && (
            <span className="todo-form-error">Please enter a task</span>
          )}
        </div>

        <div className="todo-form-field">
          <label className="todo-form-label">Category</label>
          <div className="todo-form-select-wrap">
            <select
              className={`todo-form-select${errors.category ? " todo-form-input--error" : ""}`}
              {...register("category", { required: true })}
            >
              <option value="">Select…</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <span className="todo-form-select-arrow">▾</span>
          </div>
          {errors.category && (
            <span className="todo-form-error">Please select a category</span>
          )}
        </div>

      </div>

      <button type="submit" className="todo-form-submit">
        Add task
      </button>

    </form>
  );
}

export default TodoForm;
