// Importa os hooks useState e useEffect do React para gerenciar o estado e efeitos colaterais, respectivamente, 
// e os hooks useNavigate e useParams do react-router-dom para navegação entre rotas e obtenção de parâmetros da URL.
import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

// Importa o módulo api para fazer solicitações HTTP.
import api from '../api'

// Importa o arquivo de estilo CSS.
import '../styles/EditTask.css'  // Renomeie o arquivo CSS, se necessário

// Define o componente EditTask.
function EditTask() {
  // Obtém o parâmetro taskId da URL.
  const { taskId } = useParams()
  
  // Obtém a função de navegação do hook useNavigate.
  const navigate = useNavigate()
  
  // Define estados para o título, conteúdo, imagem e imagem atual da task.
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [currentImage, setCurrentImage] = useState('')

  // Efeito que é executado quando o taskId é alterado.
  useEffect(() => {
    // Se taskId não existe, retorna.
    if (!taskId) return

    // Obtém os detalhes da task da API com base no taskId.
    api.get(`/tasks/${taskId}/`)
      .then(response => {
        // Atualiza o estado com os detalhes da task.
        setTitle(response.data.title)
        setContent(response.data.content)
        setImage(response.data.image)
        setCurrentImage(response.data.image)
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes da task:', error)
      })
  }, [taskId])

  // Função para lidar com a mudança de imagem.
  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  // Função para lidar com o envio do formulário de edição/criação da task.
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Cria um objeto FormData para enviar os dados do formulário.
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      
      // Se uma nova imagem foi selecionada e é diferente da imagem atual, adiciona a nova imagem ao FormData.
      if (image && image !== currentImage) {
        formData.append('image', image)
      }

      // Verifica se o taskId existe para determinar se é uma edição ou criação de task.
      if (taskId) {
        // Se taskId existe, faz uma solicitação PUT para atualizar a task existente.
        await api.put(`/tasks/${taskId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Task atualizada com sucesso!')
      } else {
        // Se taskId não existe, faz uma solicitação POST para criar uma nova task.
        await api.post(`/tasks/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      // Redireciona para a página de listagem de tasks após o sucesso da operação.
      navigate('/tasks')
    } catch (error) {
      console.error('Erro ao salvar task:', error)
    }
  }

  // Retorna a interface do componente EditTask.
  return (
    <div className="edit-task-container">
      {/* Título dinâmico com base na existência do taskId. */}
      <h1>{taskId ? 'Editar Task' : 'Criar Nova Task'}</h1>
      {/* Formulário de edição/criação da task. */}
      <form onSubmit={handleSubmit}>
        <div>
          {/* Exibe a imagem atual da task, se existir. */}
          {currentImage && <img src={currentImage} alt="Imagem da Task" className="task-image" />}
          {/* Input para selecionar uma nova imagem. */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {/* Inputs para inserir título e conteúdo da task. */}
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Conteúdo" value={content} onChange={(e) => setContent(e.target.value)} />
        {/* Botão para salvar a task (editar ou criar). */}
        <button className="save-button" type="submit">{taskId ? 'Salvar' : 'Criar'}</button>
        {/* Link para voltar para a listagem de tasks. */}
        <Link to="/tasks" >
          <button type="button" className="back-button">Voltar para Listagem</button>
        </Link>
      </form>
    </div>
  )
}

// Exporta o componente EditTask.
export default EditTask
