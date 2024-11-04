// Importa o arquivo de estilo CSS.
import './App.css';

// Importa os componentes das páginas que serão usadas nas rotas.
import TaskList from './components/TaskList';  // Certifique-se de ter importado corretamente o componente TaskList
import EditTask from './components/EditTask';  // Certifique-se de ter importado corretamente o componente EditTask
import Router from './AppRouter'; // Importação do componente Router
import { BrowserRouter as BrowserRoute, Routes, Route } from 'react-router-dom';


// Define o componente principal da aplicação, App.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tasks" element={<TaskList />} />  {/* Rota para a lista de tarefas */}
        <Route path="/tasks/create" element={<EditTask />} /> {/* Rota para criar tarefa */}
        <Route path="/tasks/:taskId/edit" element={<EditTask />} /> {/* Rota para editar tarefa */}
      </Routes>
    </Router>
  );
}

// Exporta o componente App.
export default App;
