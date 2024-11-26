"use client";


import styles from "./login.module.css"; // Importando o CSS corretamente
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);


    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });


      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }


      const data = await response.json();
      localStorage.setItem("token", data.access);
      router.push("/tasks");
    } catch (err: any) {
      setError(err.message);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Parte ilustrativa */}
        <div className={styles.sidebar}>
          <h1>Bem-vindo</h1>
          <p>Gerencie suas tarefas de forma eficiente e prática!</p>
        </div>


        {/* Parte de login */}
        <div className={styles.formContainer}>
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit">Entrar</button>
              <button type="button">Cadastrar</button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
