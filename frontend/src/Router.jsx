// Este código define um componente chamado AppRouter que representa as rotas da aplicação. Ele utiliza o Router do React Router para envolver a aplicação e fornecer a navegação baseada em rotas. As rotas são definidas dentro do componente Routes.

// Importa os componentes necessários do react-router-dom e os componentes da aplicação
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TaskList from './components/TaskList'
import CreateTask from "./components/CreateTask";
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import EditTask from './components/EditTask'
import ReadTask from './components/ReadTask'

// Define o componente AppRouter que contém as rotas da aplicação
// Define o componente AppRouter que contém as rotas da aplicação
function AppRouter() {
  return (
    // Define o componente Router para envolver a aplicação e fornecer navegação baseada em rotas
    <Router>
      {/* Define as rotas da aplicação */}
      <Routes>
        {/* Rota para a página de login (pública) */}
        <Route path="/" element={<Login />} />
        {/* Rotas protegidas que requerem autenticação */}
        <Route element={<PrivateRoute />}>
          {/* Rota para a listagem de tasks */}
          <Route path="/tasks" element={<TaskList />} />
          {/* Rota para criar uma nova task */}
          <Route path="/tasks/create" element={<CreateTask />} />
          {/* Rota para editar uma task existente */}
          <Route path="/tasks/:taskId/edit" element={<EditTask />} />
          {/* Rota para visualizar os detalhes de uma task */}
          <Route path="/tasks/:taskId/detail" element={<ReadTask />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter
