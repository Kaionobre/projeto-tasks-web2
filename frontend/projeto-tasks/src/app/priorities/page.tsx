"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";

interface Priority {
  id: number;
  level: string;
  description: string;
}

export default function PrioritiesPage() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [priorityToUpdate, setPriorityToUpdate] = useState<Priority | null>(
    null
  );

  const fetchPriorities = async () => {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/priorities/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Erro ao carregar as prioridades. Tente novamente."
        );
        return;
      }

      const data = await response.json();
      setPriorities(data.results || data); // Ajuste aqui se a API usa "results"
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao carregar as prioridades.");
    }
  };

  const handleDeletePriority = async (id: number) => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/priorities/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Erro ao excluir a prioridade. Tente novamente."
        );
        return;
      }

      setSuccess("Prioridade excluída com sucesso!");
      setPriorities((prevPriorities) =>
        prevPriorities.filter((priority) => priority.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao excluir a prioridade.");
    }
  };

  const handleUpdatePriority = async (
    id: number,
    updatedData: Partial<Priority>
  ) => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/priorities/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Erro ao atualizar a prioridade. Tente novamente."
        );
        return;
      }

      const updatedPriority = await response.json();
      setSuccess("Prioridade atualizada com sucesso!");
      setPriorities((prevPriorities) =>
        prevPriorities.map((priority) =>
          priority.id === id ? updatedPriority : priority
        )
      );
      setIsPriorityModalOpen(false);
      setPriorityToUpdate(null);
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao atualizar a prioridade.");
    }
  };
  

  useEffect(() => {
    fetchPriorities();
  }, []);

  const handlePrio = () => {
    window.location.href = "/priorities/create"; // Redireciona para a página de login
  };


  return (
    <div className="container">
      <header>
        <h1>Lista de Prioridades</h1>
      </header>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <section>
        {Array.isArray(priorities) && priorities.length > 0 ? (
          <ul className="priorities-list">
            {priorities.map((priority) => (
              <li key={priority.id} className="priority-item">
                <div>
                  <strong>{priority.level}</strong>: {priority.description}
                </div>
                <button
                  className="update-button"
                  onClick={() => {
                    setPriorityToUpdate(priority);
                    setIsPriorityModalOpen(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeletePriority(priority.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma prioridade encontrada.</p>
        )}
      </section>
      <button onClick={handlePrio} >Criar Prioridade</button>


      {isPriorityModalOpen && priorityToUpdate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Atualizar Prioridade</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePriority(priorityToUpdate.id, {
                  level: e.currentTarget.level.value,
                  description: e.currentTarget.description.value,
                });
              }}
            >
              <label>
                Nível:
                <input
                  type="text"
                  name="level"
                  defaultValue={priorityToUpdate.level}
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  Salvar
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsPriorityModalOpen(false);
                    setPriorityToUpdate(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
