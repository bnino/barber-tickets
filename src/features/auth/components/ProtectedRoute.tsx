  import { Navigate } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";

  type Props = {
    children: any;
    role?: string;
  };

  export default function ProtectedRoute({ children, role }: Props) {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-6">Cargando...</div>;

    if (!user) return <Navigate to="/login" />;

    if (role && user.role !== role) {
      return <Navigate to="/" />;
    }

    return children;
  }