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

  // Função para buscar as prioridades
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
      setPriorities(data.results || data); // Ajuste se a API retornar um objeto com "results"
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao carregar as prioridades.");
    }
  };

  // Função para excluir uma prioridade
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

  useEffect(() => {
    fetchPriorities();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Lista de Prioridades</h1>
      </header>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <section>
        {priorities.length === 0 ? (
          <p>Nenhuma prioridade encontrada.</p>
        ) : (
          <ul className="priorities-list">
            {priorities.map((priority) => (
              <li key={priority.id} className="priority-item">
                <div>
                  <strong>{priority.level}</strong>: {priority.description}
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeletePriority(priority.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
