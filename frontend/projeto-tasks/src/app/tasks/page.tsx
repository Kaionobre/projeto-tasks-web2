"use client";

import { useState, useEffect } from "react";
import "./styles.css";
import {Checkbox} from "@nextui-org/checkbox";
import { useRouter } from "next/navigation"; // Para redirecionar após login

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
  const router = useRouter();

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
        setTasks(tasksData.results || tasksData); // Ajuste se o backend retornar "results"
      } catch (err) {
        console.error(err);
        setError("Erro inesperado ao carregar as tarefas.");
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redireciona para a página de login
  };
  
  const handleTask = () => {
    router.push("/tasks/create"); // Redireciona para a página de login
  };
  

  return (
        <div className="body">
          <header>
            <aside className="sidebar">
              <button className="logout" onClick={handleLogout}>
                LOG OUT
              </button>
            </aside>
          </header>
          <main className="content">
          <section className="profile">
            <div className="user-info">
              <div className="user-avatar">George</div>
              <h1>Task's</h1>
            </div>
          </section>
          <section className="tasks-calendar">
            <div className="tasks">
              <h2>Atividades:</h2>
              <div className="task-grid">
                {tasks.length === 0 ? (
                  <p>Nenhuma tarefa encontrada.</p>
                ) : (
                  tasks.map((task) => (
                    <article className="task" key={task.id}>
                      <h3>{task.title}</h3>
                      <p>Ver detalhes</p>
                      <Checkbox defaultSelected>Option</Checkbox>
                      <div
                        className={`status ${
                          task.priority_level === "Alta"
                            ? "red"
                            : task.priority_level === "Média"
                            ? "orange"
                            : "green"
                        }`}
                      ></div>
                    </article>
                  ))
                )}
              </div>
            </div>
            <aside className="calendar">
              <h2>Calendário</h2>
              <div className="calendar-container">
                <p>Colocar o calendário neste espaço</p>
              </div>
            </aside>
          </section>
          <section className="actions">
            <div className="action-buttons">
              <button className="btn yellow">Criar nova Prioridade</button>
              <button className="btn purple">Criar Categoria</button>
            </div>
            <div className="add-task">
              <button className="btn red" onClick={handleTask} >Adicionar nova atividade</button>
              <button className="btn green">Concluir</button>
            </div>
          </section>
                </main>
        </div>
  );
}
