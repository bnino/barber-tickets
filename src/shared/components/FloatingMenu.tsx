import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const items = [
        { label: "Home", icon: "🏠", path: "/" },
        { label: "Dashboard", icon: "📊", path: "/dashboard" },
        { label: "TV", icon: "📺", path: "/tv" }
    ];

    const location = useLocation();

    if (location.pathname === "/tv") return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">

            <div className="relative flex flex-col items-end gap-2">

                {items.map((item, i) => (
                    <button
                        key={item.path}
                        onClick={() => {
                            navigate(item.path);
                            setOpen(false);
                        }}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-full shadow-lg
                            bg-white text-gray-800 text-sm font-semibold
                            transition-all duration-300
                            ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
                        `}
                        style={{
                            transitionDelay: `${i * 50}ms`
                        }}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}

                <button
                    onClick={() => setOpen(prev => !prev)}
                    className={`
                        w-14 h-14 cursor-pointer rounded-full shadow-xl
                        bg-gray-900 text-white text-2xl
                        flex items-center justify-center
                        transition-transform duration-300
                        ${open ? "rotate-45" : ""}
                    `}
                >
                    +
                </button>
            </div>
        </div>
    );
}