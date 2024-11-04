import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import EditTask from './components/EditTask';
import ReadTask from './components/ReadTask';

function AppRouter() {
  console.log('Iniciando as rotas'); // Adicionado para verificar inicialização
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:taskId/edit" element={<EditTask />} />
          <Route path="/tasks/:taskId/detail" element={<ReadTask />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
