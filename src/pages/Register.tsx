import { useState } from "react";
import { registerUser } from "../features/auth/services/authService";
import { useNavigate, Link } from "react-router-dom";

import { sanitizeName, sanitizeEmail } from "../shared/utils/sanitize";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cleanName = sanitizeName(name);
    const cleanEmail = sanitizeEmail(email);

    const navigate = useNavigate();

    const handleRegister = async (e: any) => {
        e.preventDefault();

        if (!cleanName || !cleanEmail || !password) {
            setError("Completa todos los campos");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            setError("");
            setLoading(true);
            await registerUser(cleanEmail, password, cleanName);
            navigate("/");
        } catch (error) {
            setError("Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">

                <h1 className="text-2xl font-bold mb-1 text-center">
                    Crear cuenta
                </h1>

                <p className="text-sm text-gray-500 mb-4 text-center">
                    Regístrate para gestionar tu barbería
                </p>

                <form onSubmit={handleRegister} className="flex flex-col gap-3">

                    <input
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <input
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="bg-black text-white p-2 rounded-lg mt-2 hover:bg-gray-900 transition disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-xs text-center mt-4 text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-black font-semibold">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}