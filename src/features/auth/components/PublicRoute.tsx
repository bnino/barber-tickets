import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: any;
};

export default function PublicRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Cargando...</div>;

  if (user) return <Navigate to="/" />;

  return children;
}