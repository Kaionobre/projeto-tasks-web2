"use client";

import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  category_name: string; // Nome da categoria
  priority_level: string; // Nível da prioridade
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData.detail || "Erro ao carregar as tarefas. Tente novamente."
          );
          return;
        }

        const tasksData = await response.json();
        console.log("Tarefas carregadas:", tasksData);
        setTasks(tasksData.results || tasksData); // Ajuste se o backend retornar "results"
      } catch (err) {
        console.error(err);
        setError("Erro inesperado ao carregar as tarefas.");
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {tasks.length === 0 ? (
          <p>Nenhuma tarefa encontrada.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p>
                  <strong>Categoria:</strong> {task.category_name}
                </p>
                <p>
                  <strong>Prioridade:</strong> {task.priority_level}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
