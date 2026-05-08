const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type RegisterUserData = {
    username: string;
    email: string;
    password: string;
};

type LoginUserData = {
    username: string;
    password: string;
};

export type AuthUser = {
    id?: string;
    username: string;
    email?: string;
};

type RegisterUserResponse = {
    message: string;
    token: string;
    user: AuthUser;
};

type LoginResponse = {
    message?: string;
    token: string;
    user?: AuthUser;
};

export type UpdateUserPayload = {
    username?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
};

type UpdateUserResponse = {
    message: string;
    user: AuthUser;
};

export async function registerUser(
    userData: RegisterUserData,
): Promise<RegisterUserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido completar el registro",
        );
    }

    return data;
}

export async function loginUser(userData: LoginUserData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "Usuario o contraseña incorrectos",
        );
    }

    if (!data?.token) {
        throw new Error("La respuesta de login no incluye token");
    }

    return data;
}

export async function logoutUser(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido cerrar la sesión",
        );
    }
}

export async function updateUser(
    userData: UpdateUserPayload,
): Promise<UpdateUserResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se ha podido validar la sesión");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se han podido actualizar tus datos",
        );
    }

    return data;
}
