import './App.css'
import Home from './pages/Home'
import PublicQueue from './pages/PublicQueue';


function App() {

  const isTV = window.location.search.includes("tv");
  return (
    <>
      {isTV ? <PublicQueue /> : <Home />}
    </>
  );
}

export default App
