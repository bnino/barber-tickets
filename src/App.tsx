import './App.css'
import { Routes, Route } from "react-router-dom";

import { useDeviceDetect } from "./shared/hooks/useDeviceDetect";

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
import Footer from "./shared/components/Footer";

function App() {

  const announcements = useAnnouncements();
  const { isTV } = useDeviceDetect();

  if (isTV) return <PublicQueue />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
      <Footer />
    </div>
  )
}

export default App
