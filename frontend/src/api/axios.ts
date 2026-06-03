import axios from "axios";

const api = axios.create({
baseURL: "https://todo-app-4xrt.onrender.com"
});

export default api;
