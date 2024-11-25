"use client";
import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";
import { useRouter } from "next/navigation"; // Para redirecionar após login


interface Category {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  level: string;
}

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();




  // Buscar categorias e prioridades
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        const [categoriesResponse, prioritiesResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/categories/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/priorities/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!categoriesResponse.ok || !prioritiesResponse.ok) {
          setError("Erro ao carregar categorias ou prioridades.");
          return;
        }

        const categoriesData = await categoriesResponse.json();
        const prioritiesData = await prioritiesResponse.json();

        setCategories(categoriesData.results || []);
        setPriorities(prioritiesData.results || []);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar dados do servidor.");
      }
    };

    fetchOptions();
  }, []);

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
  const handleLogout = () => {
    localStorage.removeItem("token");
    setError(""); // Limpa mensagens de erro
    setSuccess(""); // Limpa mensagens de sucesso
    window.location.href = "/login"; // Redireciona para a página de login
  };
  const handleTask = () => {
    router.push("/tasks"); // Redireciona para a página de login
  };
  

  return (
    
    
    <div className="container">
        <aside>
        <button className="logout-button" onClick={handleLogout} >LOG OUT</button>
      </aside>
      <main>
        <div className="user-badge">George</div>
        <header>
          <h1>Criar Task</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Título da atividade"
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
          <div>
            <select
              id="categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Selecione uma Categoria</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Carregando categorias...
                </option>
              )}
            </select>
          </div>
          <div>
            <select
              id="prioridade"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Selecione uma Prioridade</option>
              {priorities.length > 0 ? (
                priorities.map((pri) => (
                  <option key={pri.id} value={pri.id}>
                    {pri.level}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Carregando prioridades...
                </option>
              )}
            </select>
          </div>
          <button type="submit" className="save-task-button">
            Salvar Task
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
                  Criar Prioridade
                </a>
              </button>
            </span>
            <span>
              <button>
                <a href="#" className="btn-category">
                  Criar Categoria
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
