// Importa os hooks useState e useEffect do React para gerenciar o estado e efeitos colaterais,
// e o hook useNavigate do react-router-dom para navegação entre rotas.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importa o módulo api para fazer solicitações HTTP

// Importa o arquivo de estilo CSS.
import '../styles/CreateTask.css';

// Define o componente CreateTask.
function CreateTask() {
  // Define estados para armazenar o título e a descrição da tarefa.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate(); // Obtém a função de navegação do hook useNavigate

  // Função para lidar com o envio do formulário.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página
    try {
      // Faz uma solicitação POST para criar uma nova tarefa.
      await api.post('/tasks/', { title, description });
      alert('Tarefa criada com sucesso!'); // Alerta de sucesso
      navigate('/tasks'); // Redireciona para a lista de tarefas após a criação
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa.'); // Alerta de erro
    }
  };

  // Retorna a interface do componente CreateTask.
  return (
    <div className="create-task-container">
      <h1>Criar Nova Tarefa</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Atualiza o estado do título
            required // Torna o campo obrigatório
          />
        </div>
        <div>
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Atualiza o estado da descrição
            required // Torna o campo obrigatório
          />
        </div>
        <button type="submit">Criar Tarefa</button>
      </form>
    </div>
  );
}

// Exporta o componente CreateTask.
export default CreateTask;
