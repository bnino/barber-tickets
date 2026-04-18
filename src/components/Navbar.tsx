import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../shared/services/firebaseService";

export default function Navbar() {
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">

            {/* Left */}
            <div className="flex items-center gap-4">
                <Link to="/" className="font-bold text-lg">
                    💈 BarberApp
                </Link>

                <Link to="/" className="text-sm text-gray-600 hover:text-black">
                    Turnos
                </Link>

                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-black">
                    Dashboard
                </Link>

                {user?.role === "admin" && (
                    <Link to="/admin" className="text-sm text-gray-600 hover:text-black">
                        Admin
                    </Link>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

                {!user ? (
                    <Link
                        to="/login"
                        className="text-sm font-semibold bg-black text-white px-3 py-1 rounded"
                    >
                        Login
                    </Link>
                ) : (
                    <>
                        <span className="text-sm text-gray-600">
                            {user.displayName || user.email}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Cerrar sesión
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}