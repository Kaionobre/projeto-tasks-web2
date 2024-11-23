"use client";

import { useState } from "react";

export default function CreatePriorityPage() {
  const [level, setLevel] = useState(""); // Campo necessário para criar uma prioridade
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
      const response = await fetch("http://127.0.0.1:8000/api/priorities/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          level, // Envia o campo necessário
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.detail || "Erro ao criar prioridade. Verifique o campo."
        );
        return;
      }

      setSuccess("Prioridade criada com sucesso!");
      setLevel(""); // Limpa o campo após o sucesso
    } catch (err) {
      console.error(err);
      setError("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div>
      <h1>Criar Prioridade</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nível da Prioridade"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        />
        <button type="submit">Criar Prioridade</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}
