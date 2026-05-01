import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../shared/services/firebaseService";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async () => {
        if (!email) {
            setError("Ingresa tu correo electrónico");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch {
            setError("No encontramos una cuenta con ese correo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Recuperar contraseña
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Te enviaremos un enlace para restablecer tu contraseña
                    </p>
                </div>

                {sent ? (
                    <div className="text-center">
                        <div className="text-4xl mb-3">📬</div>
                        <p className="text-sm text-gray-700 font-medium">
                            Revisa tu correo
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Enviamos un enlace de recuperación a <strong>{email}</strong>
                        </p>
                        <Link
                            to="/login"
                            className="mt-5 inline-block text-sm text-indigo-600 font-semibold hover:underline"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? "Enviando..." : "Enviar enlace"}
                        </button>

                        <p className="mt-4 text-sm text-center text-gray-500">
                            <Link to="/login" className="text-black font-semibold hover:underline">
                                Volver al inicio de sesión
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}