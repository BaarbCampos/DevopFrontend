import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Today");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchTasks();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        fetchTasks();
      }
    } catch (error) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.post(
        `${API_URL}/tasks`,
        { title, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) => [...prevTasks, data]);
      setTitle("");
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 bg-gray-100 shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-700">TaskNest</h1>

      <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
        <input
          className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
        <input
          className="w-full p-2 border rounded focus:ring focus:ring-green-300"
          type="text"
          placeholder="New Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded focus:ring focus:ring-green-300"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Today">Today</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between p-2 border rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="text-gray-700 font-medium">
              {task.title} - {task.category}
            </span>
            <button
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
