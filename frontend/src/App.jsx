// Importa o arquivo de estilo CSS.
import './App.css'

// Importa o componente AppRouter, que contém as definições das rotas da aplicação.
import AppRouter from './Router'

// Define o componente principal da aplicação, App.
function App() {
  return (
    // Renderiza o componente AppRouter, que contém todas as rotas da aplicação.
    <div className="App">
      <AppRouter />
    </div>
  )
}

// Exporta o componente App.
export default App