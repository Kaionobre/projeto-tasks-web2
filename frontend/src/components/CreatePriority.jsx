import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Adicionado Link para evitar erro de importação
import api from '../api';
import '../styles/CreatePriority.css';  

function CreatePriority() {
  const [level, setLevel] = useState('');
  const [priorities, setPriorities] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (priorityid) => {
    try {
      await api.delete(`/priorities/${priorityid}/`);
      const updatedPriorities = priorities.filter(priority => priority.id !== priorityid);
      setPriorities(updatedPriorities);
    } catch (error) {
      console.error('Erro ao deletar prioridade:', error);
    }
  };

  useEffect(() => {
    // Função para buscar prioridades do backend
    const fetchPriorities = async () => {
      try {
        const response = await api.get('/priorities/');

        // Acesse o array de prioridades dentro de `results`
        if (response.data && Array.isArray(response.data.results)) {
          setPriorities(response.data.results); // Atualiza o estado com a lista de prioridades
        } else {
          console.error('Resposta inesperada da API:', response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar prioridades:', error);
      }
    };

    fetchPriorities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/priorities/', { level });
      alert('Prioridade criada com sucesso!');
  
      // Adiciona a nova prioridade ao estado local
      setPriorities([...priorities, response.data]);
  
      // Navega para a página de tarefas, se necessário
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

      {/* Lista de prioridades */}
      <h2></h2>
      <div className="task-card-container"> 
        {priorities.map(priority => (
        <div key={priority.id} className="task-card">
      <div className="task-card-title">
        {priority.level}
      </div>
      <div className="task-card-actions">
        <button onClick={() => handleDelete(priority.id)} className="task-card-link">Deletar</button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default CreatePriority;