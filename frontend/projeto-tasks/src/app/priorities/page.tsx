"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail ||
            "Erro ao carregar as categorias. Tente novamente."
        );
        return;
      }

      const data = await response.json();
      console.log("Dados retornados pela API:", data);
      setCategories(data.results || data); // Ajuste aqui se a API usa "results"
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao carregar as categorias.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/categories/${id}/`,
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
            "Erro ao excluir a categoria. Tente novamente."
        );
        return;
      }

      setSuccess("Categoria excluída com sucesso!");
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao excluir a categoria.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Lista de Categorias</h1>
      </header>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <section>
        {Array.isArray(categories) && categories.length > 0 ? (
          <ul className="categories-list">
            {categories.map((category) => (
              <li key={category.id} className="category-item">
                <div>
                  <strong>{category.name}</strong>: {category.description}
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma categoria encontrada.</p>
        )}
      </section>
    </div>
  );
}
