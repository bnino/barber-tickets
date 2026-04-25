export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Marca */}
                <div className="flex items-center gap-2">
                    <span className="text-lg">💈</span>
                    <span className="font-bold text-gray-800 text-sm">BarberApp</span>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-gray-400 text-xs">
                        Sistema de gestión de turnos en barberias
                    </span>
                </div>

                {/* Centro */}
                <p className="text-xs text-gray-400 text-center">
                    © {year} BarberApp. Todos los derechos reservados.
                </p>

                {/* Autor */}
                <p className="text-xs text-gray-400">
                    Desarrollado por{" "}

                    <a href="https://github.com/bnino"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 font-semibold hover:text-black transition hover:underline"
                    >
                        Brayan Niño
                    </a>
                </p>

            </div>
        </footer>
    );
}