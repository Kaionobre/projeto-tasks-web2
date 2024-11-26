"use client";

import { useState, useEffect } from "react";
import "./styles.css";
import { styles } from "./modalStyles";
import { useRouter } from "next/navigation"; // Para redirecionar após login
import Modal from "./modal"; // Importa o componente Modal

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

  const openDetailsModal = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedTask(null);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setTaskToDelete(task); // Define a tarefa que será excluída
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setSelectedTask(null);
  };

  const openUpdateModal = (task: Task) => {
    setTaskToUpdate(task);
    setTaskToUpdate(task); // Define a tarefa que será excluída
    setIsUpdateOpen(true);
  };
  
  const closeUpdateModal = () => {
    setTaskToUpdate(null);
    setIsUpdateOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch(
          `http://127.0.0.1:8000/api/tasks/${taskToDelete.id}/`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskToDelete.id)
          );
          closeDeleteModal();
          setTaskToDelete(null);
        } else {
          setError("Erro ao excluir a tarefa.");
        }
      } catch (err) {
        setError("Erro inesperado ao excluir a tarefa.");
      }
    }
  };
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");
  
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/${updatedTask.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );
  
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        closeUpdateModal();
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.detail || "Erro ao atualizar a tarefa.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao atualizar a tarefa.");
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
                    <h3 onClick={() => openDetailsModal(task)} >{task.title}</h3>
                    <button onClick={() => openDeleteModal(task)}>
                    Excluir
                  </button>
                  <button onClick={() => openUpdateModal(task)}>Editar</button>
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
            <button className="btn red" onClick={handleTask}>
              Adicionar nova atividade
            </button>
            <button className="btn green"></button>
          </div>
        </section>
      </main>

      {/* Modal para mostrar os detalhes da tarefa */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetailsModal}>
        {selectedTask && (
          <div>
            <h2>{selectedTask.title}</h2>
            <p>{selectedTask.description}</p>
            <p>Categoria: {selectedTask.category_name}</p>
            <p>Prioridade: {selectedTask.priority_level}</p>
          </div>
        )}
      </Modal>

        {/* Modal de Confirmação */}
        <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      >
        <p>
          Tem certeza que deseja excluir a tarefa{" "}
          <strong>{taskToDelete?.title}</strong>?
        </p>
      </Modal>

      <Modal isOpen={isUpdateOpen} onClose={closeUpdateModal}>
  {taskToUpdate && (
    <div>
      <h2>Atualizar Tarefa</h2>
      <label>
        Título:
        <input
          type="text"
          value={taskToUpdate.title}
          onChange={(e) =>
            setTaskToUpdate({ ...taskToUpdate, title: e.target.value })
          }
          required
        />
      </label>
      <label>
        Descrição:
        <textarea
          value={taskToUpdate.description}
          onChange={(e) =>
            setTaskToUpdate({ ...taskToUpdate, description: e.target.value })
          }
          required
        />
      </label>
      <label>
        Categoria:
        <input
          type="text"
          value={taskToUpdate.category_name}
          onChange={(e) =>
            setTaskToUpdate({ ...taskToUpdate, category_name: e.target.value })
          }
          required
        />
      </label>
      <label>
        Prioridade:
        <input
          type="text"
          value={taskToUpdate.priority_level}
          onChange={(e) =>
            setTaskToUpdate({ ...taskToUpdate, priority_level: e.target.value })
          }
          required
        />
      </label>
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          style={styles.confirmButton}
          onClick={() => handleUpdateTask(taskToUpdate)}
        >
          Atualizar
        </button>
        <button
          style={styles.cancelButton}
          onClick={closeUpdateModal}
        >
          Cancelar
        </button>
      </div>
    </div>
  )}
</Modal>

    </div>
  );
}
