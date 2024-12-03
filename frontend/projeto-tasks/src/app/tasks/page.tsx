"use client";

import { useState, useEffect } from "react";
import "./styles.css";
import { styles } from "./modalStyles";
import { useRouter } from "next/navigation"; // Para redirecionar após login
import Modal from "./modal"; // Importa o componente Modal
import dynamic from "next/dynamic"; // Importa dinamicamente o Calendar
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false }); // Desabilita SSR

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estado para o calendário
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();

  const fetchTasks = async (page = 1) => {
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail || "Erro ao carregar as tarefas. Tente novamente."
        );
        return;
      }

      const tasksData = await response.json();
      setTasks(tasksData.results || tasksData);
      setCurrentPage(page);
      setTotalPages(Math.ceil(tasksData.count / 6)); // Supondo 6 itens por página
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao carregar as tarefas.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redireciona para a página de login
  };

  const handleTask = () => {
    router.push("/tasks/create"); // Redireciona para a página de criação de tarefas
  };

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      console.log("Data selecionada:", value);
    } else {
      console.log("Data inválida ou múltiplas datas selecionadas.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchTasks(currentPage - 1);
    }
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
                    <h3 onClick={() => setSelectedTask(task)}>{task.title}</h3>
                    <button onClick={() => setTaskToDelete(task)}>Excluir</button>
                    <button onClick={() => setTaskToUpdate(task)}>Editar</button>
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
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </div>
          </aside>
        </section>
        <section className="actions">
          <div className="action-buttons">
            <button className="btn yellow">Criar nova Prioridade</button>
            <button className="btn purple">Criar Categoria</button>
          </div>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              className="btn"
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              className="btn"
            >
              Próxima
            </button>
          </div>
          <div className="add-task">
            <button className="btn red" onClick={handleTask}>
              Adicionar nova atividade
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
