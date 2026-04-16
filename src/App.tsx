import './App.css'
import Home from './pages/Home'
import PublicQueue from './pages/PublicQueue';


function App() {

  const params = new URLSearchParams(window.location.search);
  const isTV = params.has("tv");
  
  return isTV ? <PublicQueue /> : <Home />;;
}

export default App
