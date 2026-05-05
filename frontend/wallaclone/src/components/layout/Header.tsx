import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { logoutUser } from '../../services/authService'

function Header() {
    const navigate = useNavigate()
    const [token, setToken] = useState(() => localStorage.getItem("token"))

    const handleLogout = async () => {
        if (!token) {
            return
        }

        try {
            await logoutUser(token)
        } catch (error) {
            console.error(error)
        } finally {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setToken(null)
            navigate("/")
        }
    }

    return (
        <header className="bg-white shadow p-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link to="/" className="text-xl font-bold text-[#00bba7]">
                    Wallaclone
                </Link>

                <nav className="flex items-center gap-4 text-sm font-medium">
                    <Link to="/" className="text-gray-700 hover:text-[#00bba7]">
                        Anuncios
                    </Link>

                    {token ? (
                        <>
                            <Link
                                to="/adverts/new"
                                className="rounded-md bg-[#00bba7] px-4 py-2 text-white hover:bg-[#009689]"
                            >
                                Crear anuncio
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
    )
}

export default Header
