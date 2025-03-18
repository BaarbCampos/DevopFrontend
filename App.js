import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Atualize se necessário

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Today");
    const [email, setEmail] = useState(""); // Para login
    const [password, setPassword] = useState(""); // Para login

    // Função de login
    const handleLogin = async () => {
        try {
            console.log("Login attempt:", email, password); // Verificando os dados do login
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
                console.log("Token armazenado no localStorage!");
                fetchTasks(); // Buscar as tarefas após login
            }
        } catch (error) {
            console.error('Erro no login:', error);
        }
    };

    // Função para buscar tarefas
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found. Please log in.");
                return;
            }

            const response = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas", error);
        }
    };

    // Função para adicionar tarefas
    const addTask = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found. Please log in.");
                return;
            }

            const response = await axios.post(
                `${API_URL}/tasks`,
                { title, category },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data]);
            setTitle(""); // Limpar campo após adicionar
        } catch (error) {
            console.error("Erro ao adicionar tarefa", error);
        }
    };

    // Função para deletar tarefas
    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found. Please log in.");
                return;
            }

            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== id)); // Atualizar a lista de tarefas
        } catch (error) {
            console.error("Erro ao deletar tarefa", error);
        }
    };

    return (
        <div>
            <h1>TaskNest</h1>

            {/* Login */}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>

            {/* Tarefas */}
            <input
                type="text"
                placeholder="Nova Tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Today">Today</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
            </select>
            <button onClick={addTask}>Adicionar</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.title} - {task.category}
                        <button onClick={() => deleteTask(task._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;


