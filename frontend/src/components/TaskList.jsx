// Importa os hooks useState e useEffect do React para gerenciar o estado e efeitos colaterais, respectivamente,
// e o módulo api para fazer solicitações HTTP.
import React, { useState, useEffect } from 'react'
import api from '../api'

// Importa o componente Link do react-router-dom para navegação entre rotas.
import { Link } from 'react-router-dom'

// Importa o arquivo de estilo CSS.
import '../styles/TaskList.css'  // Renomeie o arquivo CSS, se necessário

// Define o componente TaskList.
function TaskList() {
  // Define o estado para armazenar a lista de tasks.
  const [tasks, setTasks] = useState([])

  // Função para lidar com a exclusão de uma task.
  const handleDelete = async (taskID) => {
    try {
      // Faz uma solicitação DELETE para a API para excluir a task com o ID fornecido.
      await api.delete(`/tasks/${taskID}/`)
      // Atualiza o estado removendo a task excluída da lista.
      const updatedTasks = tasks.filter(task => task.id !== taskID)
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Erro ao deletar task:', error)
    }
  }

  // Efeito que é executado uma vez após a renderização inicial do componente.
  useEffect(() => {
    console.log("teste")
    api.get('/tasks/') // substitua pela rota correta 
      .then(response => {
        console.log("vaaotacas");
        setTasks(response.data.results)
      })
      .catch(error => {
        console.error('Erro ao buscar tasks:', error);
      });
  }, []);

  // Retorna a interface do componente TaskList.
  return (
    <div className="task-list-container">
      {/* Cabeçalho da lista de tasks com um botão para criar uma nova task */}
      <div className="header">
        <h1>Lista de Tasks</h1>
        <div className="header-links">
          <Link to="/tasks/create" className="create-button">Criar Nova Task</Link>
          <Link to="/categories/create" className="create-button">Criar Categoria</Link>
          <Link to="/priorities/create" className="create-button">Criar Prioridade</Link>
        </div>
      </div>
      {/* Lista de tasks */}
      <ul>
        {/* Mapeia cada task na lista de tasks e renderiza um item de lista para cada uma */}
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            {/* Link para os detalhes da task */}
            <Link to={`/tasks/${task.id}/detail`} className="task-link-name">{task.title}</Link>
            {/* Botões de ação para editar e excluir a task */}
            <div className="actions">
              <Link to={`/tasks/${task.id}/edit`} className="task-link">Editar</Link>
              <button onClick={() => handleDelete(task.id)} className="delete-button">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Exporta o componente TaskList.
export default TaskList
