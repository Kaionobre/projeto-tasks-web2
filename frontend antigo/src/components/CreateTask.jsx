import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api'
import '../styles/CreateTask.css'

function CreateTask() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([]) // Para armazenar categorias
  const [priorities, setPriorities] = useState([]) // Para armazenar prioridades
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  
  useEffect(() => {
    // Buscar categorias e prioridades
    const fetchCategoriesAndPriorities = async () => {
      try {
        const categoriesResponse = await api.get('/categories/') 
        const prioritiesResponse = await api.get('/priorities/') 

        console.log('Categorias:', categoriesResponse.data); // Log das categorias
        console.log('Prioridades:', prioritiesResponse.data); // Log das prioridades

        // Acesse o array results para armazenar as categorias e prioridades
        setCategories(categoriesResponse.data.results);
        setPriorities(prioritiesResponse.data.results);
      } catch (error) {
        console.error('Erro ao buscar categorias e prioridades:', error)
      }
    }

    fetchCategoriesAndPriorities()
  }, [])

  useEffect(() => {
    if (!postId) return
  
    api.get(`/tasks/${postId}/`)
      .then(response => {
        setTitle(response.data.title)
        setContent(response.data.description)
        setSelectedCategory(response.data.category)
        setSelectedPriority(response.data.priority)
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do post:', error)
      })
  }, [postId])  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', content);
      formData.append('completed', false);
      formData.append('category', selectedCategory);
      formData.append('priority', selectedPriority);

      await api.post('/tasks/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Tarefa criada com sucesso!');
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  }

  return (
    <div className="edit-task-container">
      <h1>{postId ? 'Editar Post' : 'Criar Nova Task'}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Título" 
          name='titulo'
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          placeholder="Conteúdo" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
         <option value="">Selecione uma Categoria</option>
       {categories.length > 0 ? (
          categories.map(category => (
         <option key={category.id} value={category.id}>{category.name}</option>
         ))
  ) : (
    <option value="" disabled>Carregando categorias...</option>
  )}
</select>

        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
        <option value="">Selecione uma Prioridade</option>
        {priorities.length > 0 ? (
          priorities.map(priority => (
      <option key={priority.id} value={priority.id}>{priority.level}</option>
    ))
  ) : (
    <option value="" disabled>Carregando prioridades...</option>
  )}
</select>

        <button className="save-button" type="submit">{postId ? 'Salvar' : 'Criar'}</button>
        <Link to="/tasks">
          <button type="button" className="back-button">Voltar para Listagem</button>
        </Link>
      </form>
    </div>
  )
}

export default CreateTask