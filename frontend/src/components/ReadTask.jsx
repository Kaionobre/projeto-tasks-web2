// Importa os hooks useState e useEffect do React para gerenciar o estado e efeitos colaterais, respectivamente,
// o hook useParams do react-router-dom para obter parâmetros da URL,
// e o módulo api para fazer solicitações HTTP.
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

// Importa o arquivo de estilo CSS.
import '../styles/ReadTask.css'  // Renomeie o arquivo CSS, se necessário

// Define o componente ReadTask.
function ReadTask() {
  // Obtém o parâmetro taskId da URL.
  const { taskId } = useParams()

  // Define estados para armazenar o título, conteúdo e imagem da task.
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')

  // Efeito que é executado quando o taskId é alterado.
  useEffect(() => {
    // Faz uma solicitação GET para a API para obter os detalhes da task com o ID fornecido.
    api.get(`/tasks/${taskId}/`)
      .then(response => {
        // Atualiza o estado com os detalhes da task obtidos da API.
        setTitle(response.data.title)
        setContent(response.data.content)
        setImage(response.data.image)
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes da task:', error)
      })
  }, [taskId])

  // Retorna a interface do componente ReadTask.
  return (
    <div className="read-task-container">
      {/* Título da página */}
      <h1>Detalhes da Task</h1>
      {/* Link para voltar para a lista de tasks */}
      <Link to="/tasks" >
        <button type="button" className="back-button">Voltar para Listagem</button>
      </Link>
      {/* Título da task */}
      <h2>{title}</h2>
      {/* Conteúdo da task */}
      <p>{content}</p>
      {/* Imagem da task, se existir */}
      {image && <img src={image} alt="Imagem da Task" className="task-image" />}
    </div>
  )
}

// Exporta o componente ReadTask.
export default ReadTask
