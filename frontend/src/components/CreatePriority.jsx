import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Adicionado Link para evitar erro de importação
import api from '../api';
import '../styles/CreatePriority.css';  

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

        <div className="button-container">
          <button type="submit" className="create-button">Criar Prioridade</button>
          <Link to="/tasks" className="back-link">
            <button type="button" className="back-button">Voltar para Listagem</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreatePriority;