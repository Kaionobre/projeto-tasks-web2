"use client";
import React, { useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";

export default function CreatePriorityPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/priorities/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          level: title,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Erro ao criar a prioridade. Verifique os campos e tente novamente."
        );
        return;
      }

      setSuccess("Prioridade criada com sucesso!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Erro inesperado. Tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setError("");
    setSuccess("");
    window.location.href = "/login";
  };

  const handleTask = () => {
    window.location.href = "/tasks"; 
  };

  return (
    <div className="container">
      <aside>
        <button className="logout-button" onClick={handleLogout}>
          LOG OUT
        </button>
      </aside>
      <main>
        <div className="user-badge">George</div>
        <header>
          <h1>Criar Prioridade</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Título da Prioridade"
              id="titulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea
              id="descricao"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="save-task-button">
            Salvar Prioridade
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <h2>Adicionar nova Task</h2>
        <div className="button-conteiner">
          <div>
            <span>
              <button>
                <a href="#" className="btn-priority">
                  Listar Prioridade
                </a>
              </button>
            </span>
            <span>
              <button>
                <a href="#" className="btn-category">
                  Excluir Prioridade
                </a>
              </button>
            </span>
          </div>
          <div>
            <button>
              <a href="#" className="btn-back" onClick={handleTask}>
                Voltar para tela inicial
              </a>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
