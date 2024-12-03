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
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);

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
          errorData.detail || "Erro ao carregar as categorias. Tente novamente."
        );
        return;
      }

      const data = await response.json();
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
          errorData.detail || "Erro ao excluir a categoria. Tente novamente."
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

  const handleUpdateCategory = async (id: number, updatedData: Partial<Category>) => {
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
            "Erro ao atualizar a categoria. Tente novamente."
        );
        return;
      }

      const updatedCategory = await response.json();
      setSuccess("Categoria atualizada com sucesso!");
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
      setIsUpdateOpen(false);
      setCategoryToUpdate(null);
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao atualizar a categoria.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCateg = () => {
    window.location.href = "/categories/create"; // Redireciona para a página de login
  };

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
                  className="update-button"
                  onClick={() => {
                    setCategoryToUpdate(category);
                    setIsUpdateOpen(true);
                  }}
                >
                  Editar
                </button>

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
      
      <button className="create-button" onClick={handleCateg} > Criar categoria</button>


      {isUpdateOpen && categoryToUpdate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Atualizar Categoria</h2>
            <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const name = (form.elements.namedItem("name") as HTMLInputElement).value;

            handleUpdateCategory(categoryToUpdate.id, {
              name
            });
          }}
>

              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  defaultValue={categoryToUpdate.name}
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
                    setIsUpdateOpen(false);
                    setCategoryToUpdate(null);
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
