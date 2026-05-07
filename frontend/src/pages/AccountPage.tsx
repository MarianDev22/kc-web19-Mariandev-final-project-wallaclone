import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    updateUser,
    type AuthUser,
    type UpdateUserPayload,
} from "../services/authService";

type AccountErrors = {
    username?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    general?: string;
};

function getStoredUser() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as AuthUser;
    } catch {
        return null;
    }
}

function AccountPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [errors, setErrors] = useState<AccountErrors>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const currentUser = getStoredUser();

        if (currentUser) {
            setUsername(currentUser.username ?? "");
            setEmail(currentUser.email ?? "");
        }
    }, [navigate]);

    const validate = () => {
        const newErrors: AccountErrors = {};

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedCurrentPassword = currentPassword.trim();
        const trimmedNewPassword = newPassword.trim();
        const trimmedConfirmNewPassword = confirmNewPassword.trim();

        if (!trimmedUsername) {
            newErrors.username = "El nombre de usuario es obligatorio";
        }

        if (!trimmedEmail) {
            newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Introduce un email válido";
        }

        const isChangingPassword =
            Boolean(trimmedCurrentPassword) ||
            Boolean(trimmedNewPassword) ||
            Boolean(trimmedConfirmNewPassword);

        if (isChangingPassword) {
            if (!trimmedCurrentPassword) {
                newErrors.currentPassword =
                    "Indica tu contraseña actual para cambiarla";
            } else if (trimmedCurrentPassword.length < 6) {
                newErrors.currentPassword =
                    "La contraseña actual debe tener al menos 6 caracteres";
            } else if (trimmedCurrentPassword.length > 64) {
                newErrors.currentPassword =
                    "La contraseña actual no puede tener más de 64 caracteres";
            }

            if (!trimmedNewPassword) {
                newErrors.newPassword = "Indica la nueva contraseña";
            } else if (trimmedNewPassword.length < 6) {
                newErrors.newPassword =
                    "La nueva contraseña debe tener al menos 6 caracteres";
            } else if (trimmedNewPassword.length > 64) {
                newErrors.newPassword =
                    "La nueva contraseña no puede tener más de 64 caracteres";
            }

            if (!trimmedConfirmNewPassword) {
                newErrors.confirmNewPassword = "Confirma la nueva contraseña";
            } else if (trimmedNewPassword !== trimmedConfirmNewPassword) {
                newErrors.confirmNewPassword = "Las contraseñas no coinciden";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const storedUser = getStoredUser();

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedCurrentPassword = currentPassword.trim();
        const trimmedNewPassword = newPassword.trim();

        const payload: UpdateUserPayload = {};

        if (trimmedUsername !== storedUser?.username) {
            payload.username = trimmedUsername;
        }

        if (trimmedEmail !== storedUser?.email) {
            payload.email = trimmedEmail;
        }

        if (trimmedNewPassword) {
            payload.currentPassword = trimmedCurrentPassword;
            payload.newPassword = trimmedNewPassword;
        }

        if (Object.keys(payload).length === 0) {
            setErrors({
                general: "No has cambiado ningún dato",
            });
            setSuccessMessage("");
            return;
        }

        try {
            setIsLoading(true);
            setErrors({});
            setSuccessMessage("");

            const data = await updateUser(payload);

            localStorage.setItem("user", JSON.stringify(data.user));

            setUsername(data.user.username ?? "");
            setEmail(data.user.email ?? "");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setSuccessMessage(data.message);
        } catch (error) {
            setErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : "No se han podido actualizar tus datos",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-3xl">
                <Link
                    to="/"
                    className="mb-6 inline-block text-sm font-semibold text-[#00bba7] hover:text-[#009689]"
                >
                    Volver a anuncios
                </Link>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Mi cuenta
                        </h1>
                        <p className="mt-2 text-base text-gray-600">
                            Actualiza tus datos de usuario y contraseña
                        </p>
                    </div>

                    {successMessage && (
                        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {successMessage}
                        </div>
                    )}

                    {errors.general && (
                        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Nombre de usuario
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                    setErrors((currentErrors) => ({
                                        ...currentErrors,
                                        username: undefined,
                                        general: undefined,
                                    }));
                                    setSuccessMessage("");
                                }}
                                disabled={isLoading}
                                className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.username ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Tu nombre de usuario"
                            />

                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setErrors((currentErrors) => ({
                                        ...currentErrors,
                                        email: undefined,
                                        general: undefined,
                                    }));
                                    setSuccessMessage("");
                                }}
                                disabled={isLoading}
                                className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="tu@email.com"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Cambiar contraseña
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                Si no quieres cambiarla, deja estos campos vacíos.
                            </p>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <label
                                        htmlFor="currentPassword"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Contraseña actual
                                    </label>

                                    <input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) => {
                                            setCurrentPassword(event.target.value);
                                            setErrors((currentErrors) => ({
                                                ...currentErrors,
                                                currentPassword: undefined,
                                                general: undefined,
                                            }));
                                            setSuccessMessage("");
                                        }}
                                        disabled={isLoading}
                                        minLength={6}
                                        maxLength={64}
                                        className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.currentPassword
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                        placeholder="Tu contraseña actual"
                                    />

                                    {errors.currentPassword && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.currentPassword}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Nueva contraseña
                                    </label>

                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) => {
                                            setNewPassword(event.target.value);
                                            setErrors((currentErrors) => ({
                                                ...currentErrors,
                                                newPassword: undefined,
                                                confirmNewPassword: undefined,
                                                general: undefined,
                                            }));
                                            setSuccessMessage("");
                                        }}
                                        disabled={isLoading}
                                        minLength={6}
                                        maxLength={64}
                                        className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.newPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="Nueva contraseña"
                                    />

                                    {errors.newPassword && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.newPassword}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmNewPassword"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Confirmar nueva contraseña
                                    </label>

                                    <input
                                        id="confirmNewPassword"
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(event) => {
                                            setConfirmNewPassword(event.target.value);
                                            setErrors((currentErrors) => ({
                                                ...currentErrors,
                                                confirmNewPassword: undefined,
                                                general: undefined,
                                            }));
                                            setSuccessMessage("");
                                        }}
                                        disabled={isLoading}
                                        minLength={6}
                                        maxLength={64}
                                        className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.confirmNewPassword
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                        placeholder="Repite la nueva contraseña"
                                    />

                                    {errors.confirmNewPassword && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.confirmNewPassword}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? "Guardando cambios..." : "Guardar cambios"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AccountPage;
