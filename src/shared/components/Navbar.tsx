import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../features/auth/context/AuthContext";
import { auth } from "../services/firebaseService";

import { useSettings } from "../../features/settings/hooks/useSettings";

export default function Navbar() {

    const { user } = useAuth();
    const { companyName } = useSettings();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await signOut(auth);
    };

    const getInitial = () => {
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "U";
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">

            {/* Left */}
            <div className="flex items-center gap-6">
                <Link to="/" className="font-bold text-lg">
                    💈 {companyName}
                </Link>

            </div>

            {/* Right */}
            <div className="relative" ref={dropdownRef}>

                {!user ? (
                    <Link
                        to="/login"
                        className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 "
                    >
                        Iniciar sesión
                    </Link>
                ) : (
                    <>
                        <button
                            onClick={() => setOpen(!open)}
                            className="cursor-pointer w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold hover:scale-105 transition"
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getInitial()
                            )}
                        </button>
                        
                        <div
                            className={`absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg p-2 z-50 transition-all duration-200 origin-top-right
                            ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        >

                            <div className="px-3 py-2 border-b">
                                <p className="text-sm font-semibold truncate">
                                    {user.displayName || user.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user.role}
                                </p>
                            </div>
                            <Link
                                to="/"
                                className="block px-3 py-2 text-sm hover:bg-gray-100 rounded transition"
                                onClick={() => setOpen(false)}
                            >
                                Turnos
                            </Link>

                            {user.role === "admin" && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded transition"
                                        onClick={() => setOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/admin"
                                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded transition"
                                        onClick={() => setOpen(false)}
                                    >
                                        Panel Admin
                                    </Link>
                                </>
                            )}

                            <button
                                onClick={handleLogout}
                                className="cursor-pointer w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded transition"
                            >
                                Cerrar sesión
                            </button>
                        </div>

                    </>
                )}
            </div>
        </nav>
    );
}