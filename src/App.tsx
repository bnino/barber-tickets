import './App.css'
import { Routes, Route, } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
import PublicQueue from './pages/PublicQueue';
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from './pages/Register';

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";

import Navbar from "./shared/components/Navbar";

function App() {

  const params = new URLSearchParams(window.location.search);
  const isTV = params.has("tv");

  if (isTV) return <PublicQueue />;

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute role="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          } />
      </Routes>
    </>
  )
}

/* function RedirectByQuery() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("tv")) {
    return <Navigate to="/tv" replace />;
  }

  return <Navigate to="/" replace />;
} */

export default App
