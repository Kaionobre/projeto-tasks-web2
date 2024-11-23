"use client";

import { useState } from "react";

export default function CreateCategoryPage() {
  const [name, setName] = useState(""); // Campo necessário para criar uma categoria
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
      const response = await fetch("http://127.0.0.1:8000/api/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name, // Envia apenas o campo necessário
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail || "Erro ao criar categoria. Verifique o campo."
        );
        return;
      }

      setSuccess("Categoria criada com sucesso!");
      setName(""); // Limpa o campo após o sucesso
    } catch (err) {
      console.error(err);
      setError("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div>
      <h1>Criar Categoria</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Criar Categoria</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
