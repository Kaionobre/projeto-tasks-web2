import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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
        <button type="submit">Criar Categoria</button>
      </form>
    </div>
  );
}

export default CreateCategory;
