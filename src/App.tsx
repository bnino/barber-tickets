import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
import PublicQueue from './pages/PublicQueue';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tv" element={<PublicQueue />} />
        <Route path="*" element={<RedirectByQuery />} />
      </Routes>
    </BrowserRouter>
  )
}

function RedirectByQuery() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("tv")) {
    return <Navigate to="/tv" replace />;
  }

  return <Navigate to="/" replace />;
}

export default App
