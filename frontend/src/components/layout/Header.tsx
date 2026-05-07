import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <header className="border-b border-gray-100 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="text-xl font-bold text-[#00bba7]">
                    Wallaclone
                </Link>

                <nav className="flex items-center gap-4 text-sm font-semibold">
                    {token ? (
                        <>
                            <Link
                                to="/adverts/new"
                                className="rounded-md bg-[#00bba7] px-4 py-2 text-white hover:bg-[#009689]"
                            >
                                Crear anuncio
                            </Link>

                            <Link
                                to="/account"
                                className="rounded-md bg-[#00bba7] px-4 py-2 text-white hover:bg-[#009689]"
                            >
                                Mi cuenta
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-[#00bba7]"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-gray-700 hover:text-[#00bba7]">
                            Iniciar sesión
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
