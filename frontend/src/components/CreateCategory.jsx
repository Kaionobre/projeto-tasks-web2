import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../styles/CreateCategory.css';  

function CreateCategory() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

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
    </div>
  );
}

export default CreateCategory;
