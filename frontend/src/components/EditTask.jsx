// Importa os hooks useState e useEffect do React para gerenciar o estado e efeitos colaterais, respectivamente, 
// e os hooks useNavigate e useParams do react-router-dom para navegação entre rotas e obtenção de parâmetros da URL.
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

// Importa o módulo api para fazer solicitações HTTP.
import api from '../api';

// Importa o arquivo de estilo CSS.
import '../styles/EditTask.css';  // Renomeie o arquivo CSS, se necessário

// Define o componente EditTask.
function EditTask() {
  // Obtém o parâmetro taskId da URL.
  const { taskId } = useParams();

  // Obtém a função de navegação do hook useNavigate.
  const navigate = useNavigate();

  // Define estados para o título, descrição, imagem, imagem atual, categoria e prioridade da task.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(null);
  const [categories, setCategories] = useState([]); // Para armazenar categorias
  const [priorities, setPriorities] = useState([]); // Para armazenar prioridades
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [error, setError] = useState(null); // Para gerenciar erros de forma mais eficaz
  const [selectedOption, setSelectedOption] = useState("opcao1");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOptionChange2 = (event) => {
    const value = event.target.value === "complete"; // 'complete' ou 'incomplete'
    setCompleted(value); // Atualiza o estado local
  };


  // Efeito que é executado quando o taskId é alterado.
  useEffect(() => {
    // Se taskId não existe, retorna.
    if (!taskId) return;

    // Obtém os detalhes da task da API com base no taskId.
    api.get(`/tasks/${taskId}/`)
      .then(response => {
        // Atualiza o estado com os detalhes da task.
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCompleted(response.data.completed)
        setSelectedCategory(response.data.category); // Supondo que a resposta tenha o ID da categoria
        setSelectedPriority(response.data.priority); // Supondo que a resposta tenha o ID da prioridade
      })
      .catch(error => {
        setError('Erro ao buscar detalhes da task.'); // Define uma mensagem de erro
        console.error('Erro ao buscar detalhes da task:', error);
      });
    
    // Limpeza do estado ao desmontar o componente
    return () => {
      setTitle('');
      setDescription('');
      setCompleted('');
      setSelectedCategory('');
      setSelectedPriority('');
      setError(null);
    };
  }, [taskId]);

  // Efeito para buscar categorias e prioridades quando o componente é montado
  useEffect(() => {
    const fetchCategoriesAndPriorities = async () => {
      try {
        const [categoriesResponse, prioritiesResponse] = await Promise.all([
          api.get('/categories/'), // Altere o endpoint conforme necessário
          api.get('/priorities/'), // Altere o endpoint conforme necessário
        ]);
        setCategories(categoriesResponse.data.results);
        setPriorities(prioritiesResponse.data.results);
      } catch (error) {
        setError('Erro ao buscar categorias e prioridades.');
        console.error('Erro ao buscar categorias e prioridades:', error);
      }
    };

    fetchCategoriesAndPriorities();
  }, []);

  // Função para lidar com a mudança de imagem.
   //const handleImageChange = (e) => {
    // setImage(e.target.files[0]);
   //};

   const handleSave = async () => {
    try {
      const response = await api.patch(`/tasks/${taskId}/`, { completed });
    } catch (error) {
    }
  };

  // Função para lidar com o envio do formulário de edição/criação da task.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reseta o erro antes de submeter

    try {
      // Cria um objeto FormData para enviar os dados do formulário.
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', selectedCategory);
      formData.append('priority', selectedPriority);
      
      // Se uma nova imagem foi selecionada e é diferente da imagem atual, adiciona a nova imagem ao FormData.
     // if (image && image.name !== currentImage.split('/').pop()) { // Verifica pelo nome da imagem
      //  formData.append('image', image);
     // }

      // Verifica se o taskId existe para determinar se é uma edição ou criação de task.
      if (taskId) {
        // Se taskId existe, faz uma solicitação PUT para atualizar a task existente.
        await api.put(`/tasks/${taskId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Task atualizada com sucesso!');
      } else {
        // Se taskId não existe, faz uma solicitação POST para criar uma nova task.
        await api.post(`/tasks/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Task criada com sucesso!');
      }
      
      // Redireciona para a página de listagem de tasks após o sucesso da operação.
      navigate('/tasks');
    } catch (error) {
      setError('Erro ao salvar task.'); // Define uma mensagem de erro
      console.error('Erro ao salvar task:', error);
    }
  };
  

  // Retorna a interface do componente EditTask.
  return (
    <div className="edit-task-container">
      <h1>{taskId ? 'Editar Task' : 'Criar Nova Task'}</h1>
      {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro */}
      <form onSubmit={handleSubmit}>

        <input 
          type="text" 
          placeholder="Título" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required // Campo obrigatório
        />
        <textarea 
          placeholder="Descrição" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required // Campo obrigatório
        />
    <div>
      <h1>Editar Tarefa</h1>
      <label>
        Tarefa Completa:
        <input
          type="checkbox"
          checked={completed} // O input é controlado pelo estado
          onChange={() => setCompleted(prev => !prev)} // Alterna o estado
        />
      </label>
    </div>

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          required // Campo obrigatório
        >
          <option value="" disabled>Selecione uma Categoria</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select 
          value={selectedPriority} 
          onChange={(e) => setSelectedPriority(e.target.value)} 
          required // Campo obrigatório
        >
          <option value="" disabled>Selecione uma Prioridade</option>
          {priorities.map(priority => (
            <option key={priority.id} value={priority.id}>{priority.level}</option>
          ))}
        </select>
        <button 
          onClick={handleSave}
          className="save-button" 
          type="submit" 
          disabled={!title || !description || !selectedCategory || !selectedPriority} // Desabilita se os campos obrigatórios não estiverem preenchidos
        >
          {taskId ? 'Salvar' : 'Criar'}
        </button>
        <Link to="/tasks">
          <button type="button" className="back-button">Voltar para Listagem</button>
        </Link>
      </form>
    </div>
  );
}

// Exporta o componente EditTask.
export default EditTask;
