const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type CloudinaryUploadResponse = {
    secure_url?: string;
    error?: {
        message?: string;
    };
};

export async function uploadAdvertImage(file: File): Promise<string> {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error("La subida de imágenes no está configurada");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error("La imagen debe ser JPG, PNG o WEBP");
    }

    if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
        throw new Error("La imagen no puede superar los 5 MB");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        },
    );

    const data = (await response
        .json()
        .catch(() => null)) as CloudinaryUploadResponse | null;

    if (!response.ok) {
        throw new Error(
            data?.error?.message ?? "No se ha podido subir la imagen",
        );
    }

    if (!data?.secure_url) {
        throw new Error("Cloudinary no ha devuelto la URL de la imagen");
    }

    return data.secure_url;
}
