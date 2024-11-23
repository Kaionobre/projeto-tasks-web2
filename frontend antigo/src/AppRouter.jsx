import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import EditTask from './components/EditTask';
import ReadTask from './components/ReadTask';
import CreateCategory from './components/CreateCategory';
import CreatePriority from './components/CreatePriority';

function AppRouter() {
  console.log('Iniciando as rotas');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:taskId/edit" element={<EditTask />} />
          <Route path="/tasks/:taskId/detail" element={<ReadTask />} />
          <Route path="/categories/create" element={<CreateCategory />} />
          <Route path="/priorities/create" element={<CreatePriority />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
