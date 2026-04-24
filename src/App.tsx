import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";

import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
import PublicQueue from './pages/PublicQueue';
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from './pages/Register';

import { useAnnouncements } from "./features/announcements/hooks/useAnnouncements";
import AnnouncementModal from "./shared/components/AnnouncementModal";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";

import Navbar from "./shared/components/Navbar";

function App() {

  const announcements = useAnnouncements();

  const location = useLocation();

  const isTV =
    location.pathname === "/tv" ||
    new URLSearchParams(location.search).has("tv");

  if (isTV) return <PublicQueue />;

  return (
    <>
      {!isTV && <Navbar />}

      {announcements.map(a => (
        <AnnouncementModal key={a.id} announcement={a} />
      ))}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tv" element={<PublicQueue />} />
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
      <p className="text-sm text-gray-500 mt-6 text-end mb-4 mr-4">
        Desarrollado por <a href="https://github.com/bnino" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Brayan Niño
        </a>
      </p>
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
