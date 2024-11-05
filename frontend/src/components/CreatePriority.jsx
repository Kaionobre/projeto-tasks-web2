import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function CreatePriority() {
  const [level, setLevel] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/priorities/', { level });
      alert('Prioridade criada com sucesso!');
      navigate('/tasks');
    } catch (error) {
      console.error('Erro ao criar prioridade:', error);
    }
  };

  return (
    <div>
      <h2>Criar Nova Prioridade</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nível da Prioridade"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        <button type="submit">Criar Prioridade</button>
      </form>
    </div>
  );
}

export default CreatePriority;
