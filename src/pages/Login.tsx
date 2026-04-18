import { useState } from "react";
import { loginWithGoogle, loginWithEmail } from "../features/auth/services/authService";
import { useNavigate, Link } from "react-router-dom";
import googleIcon from "../assets/google.svg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleEmailLogin = async () => {
        setError("");

        if (!email || !password) {
            setError("Completa todos los campos");
            return;
        }

        try {
            setLoading(true);
            await loginWithEmail(email, password);
            navigate("/");
        } catch (err: any) {
            setError("Correo o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
            navigate("/");
        } catch (err) {
            setError("Error al iniciar con Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Iniciar sesión
                    </h1>
                    <p className="text-sm text-gray-500">
                        Accede a tu cuenta
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Inputs */}
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />

                {/* Login email */}
                <button
                    onClick={handleEmailLogin}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-lg font-semibold transition hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Ingresando..." : "Ingresar"}
                </button>

                {/* Divider */}
                <div className="my-4 flex items-center gap-2 text-sm text-gray-400">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span>o</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Google */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                    <img src={googleIcon} alt="Google" className="w-5 h-5" />
                    <span className="font-medium">Continuar con Google</span>
                </button>

                {/* Register */}
                <p className="mt-5 text-sm text-center text-gray-500">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-black font-semibold hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}