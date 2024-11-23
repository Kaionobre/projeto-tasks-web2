import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../api';
import '../styles/CreateCategory.css';  

function CreateCategory() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]); // Inicialize como array vazio
  const navigate = useNavigate();

  const handleDelete = async (categoryid) => {
    try {
      await api.delete(`/categories/${categoryid}/`);
      const updatedCategories = categories.filter(category => category.id !== categoryid);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Erro ao deletar prioridade:', error);
    }
  };

  useEffect(() => {
    // Função para buscar categorias do backend
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        
        // Certifique-se de que a resposta é um array
        if (Array.isArray(response.data.results)) {
          setCategories(response.data.results); // Atualiza o estado com a lista de categorias
        } else {
          console.error('Resposta inesperada da API:', response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories/', { name });
      alert('Categoria criada com sucesso!');
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  return (
    <div>
      <h2>Criar Nova Categoria</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="button-container">
          <button type="submit" className="create-button">Criar Categoria</button>
          <Link to="/tasks" className="back-link">
            <button type="button" className="back-button">Voltar para Listagem</button>
          </Link>
        </div>
      </form>

      {/* Lista de categorias */}
      <div className="task-card-container"> 
       {categories.map(category => (
    <div key={category.id} className="task-card">
      <div className="task-card-title">
        {category.name}
      </div>
      <div className="task-card-actions">
        <button onClick={() => handleDelete(category.id)} className="task-card-link">Deletar</button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
export default CreateCategory;