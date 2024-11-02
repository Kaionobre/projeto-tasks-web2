// Importa os hooks useState e useEffect do React para gerenciar o estado e efeitos colaterais, respectivamente,
// e o módulo api para fazer solicitações HTTP.
import { useState, useEffect } from 'react'
import api from '../api'

// Importa o componente Link do react-router-dom para navegação entre rotas.
import { Link } from 'react-router-dom'

// Importa o arquivo de estilo CSS.
import '../styles/PostList.css'

// Define o componente PostList.
function PostList() {
  // Define o estado para armazenar a lista de posts.
  const [posts, setPosts] = useState([])

  // Função para lidar com a exclusão de um post.
  const handleDelete = async (postId) => {
    try {
      // Faz uma solicitação DELETE para a API para excluir o post com o ID fornecido.
      await api.delete(`/tasks/${postId}/`)
      // Atualiza o estado removendo o post excluído da lista.
      const updatedPosts = posts.filter(post => post.id !== postId)
      setPosts(updatedPosts)
    } catch (error) {
      console.error('Erro ao deletar post:', error)
    }
  }

  // Efeito que é executado uma vez após a renderização inicial do componente.
  useEffect(() => {
    // Faz uma solicitação GET para a API para obter a lista de posts.
    api.get(`/tasks/`)
      .then(response => {
        // Atualiza o estado com a lista de posts obtida da API.
        setPosts(response.data)
      })
      .catch(error => {
        console.error('Erro ao buscar posts:', error)
      })
  }, [])

  // Retorna a interface do componente PostList.
  return (
    <div className="post-list-container">
      {/* Cabeçalho da lista de posts com um botão para criar um novo post */}
      <div className="header">
        <h1>Lista de tasks</h1>
        <Link to="/posts/create" className="create-button">Criar Novo Post</Link> {/* Adiciona um link para criar um novo post */}
      </div>
      {/* Lista de posts */}
      <ul>
        {/* Mapeia cada post na lista de posts e renderiza um item de lista para cada um */}
        {posts.map(post => (
          <li key={post.id} className="post-item">
            {/* Link para os detalhes do post */}
            <Link to={`/posts/${post.id}/detail`} className="post-link-name">{post.title}</Link>
            {/* Botões de ação para editar e excluir o post */}
            <div className="actions">
              <Link to={`/posts/${post.id}/edit`} className="post-link">Editar</Link>
              <button onClick={() => handleDelete(post.id)} className="delete-button">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Exporta o componente PostList.
export default PostList