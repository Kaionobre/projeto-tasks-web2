"use client";

import { useState } from "react";
import "./styles.css";

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Erro ao criar a tarefa. Verifique os campos e tente novamente."
        );
        return;
      }

      setSuccess("Tarefa criada com sucesso!");
      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
    } catch (err) {
      console.error(err);
      setError("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="container">
      <aside>
        <button className="logout-button">LOG OUT</button>
      </aside>
      <main>
        <div className="user-badge">George</div>
        <header>
          <h1>Criar Task</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="text" placeholder="Título da atividade" id="titulo" value={title} onChange={(e) => setTitle(e.target.value)} required/>
          </div>
          <div>
            <textarea id="descricao" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required ></textarea>
          </div>
          <div>
            <input type="number" placeholder="Categoria" id="categoria" value={category} onChange={(e) => setCategory(e.target.value)} required/>
          </div>
          <div>
            <input type="number" placeholder="Prioridade" id="prioridade" value={priority} onChange={(e) => setPriority(e.target.value)} required />
          </div>
          <button type="submit" className="save-task-button"> Salvar Task </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
          <h2>Adicionar nova Task</h2>
          <div className="button-conteiner">
            <div>
              <span><button><a href="#" className="btn-priority"> Criar Prioridade </a></button></span>
              <span><button><a href="#" className="btn-category">Criar Categoria</a></button></span>
            </div>
            <div><button><a href="#" className="btn-back"> Voltar para tela inicial</a></button></div>
          </div>
      </main>
    </div>
  );
}
