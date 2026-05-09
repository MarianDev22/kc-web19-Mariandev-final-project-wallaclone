import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAdvert } from "../services/advertService";
import { uploadAdvertImage } from "../services/imageUploadService";

type CreateAdvertErrors = {
    name?: string;
    description?: string;
    price?: string;
    image?: string;
    tags?: string;
    general?: string;
};

function CreateAdvertPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [tags, setTags] = useState("");
    const [isSale, setIsSale] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [selectedImageName, setSelectedImageName] = useState("");
    const [errors, setErrors] = useState<CreateAdvertErrors>({});

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const getParsedTags = () => {
        return tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
    };

    const validate = () => {
        const newErrors: CreateAdvertErrors = {};
        const numericPrice = Number(price);

        if (!name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        } else if (name.trim().length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres";
        }

        if (!description.trim()) {
            newErrors.description = "La descripción es obligatoria";
        } else if (description.trim().length < 5) {
            newErrors.description = "La descripción debe tener al menos 5 caracteres";
        } else if (description.trim().length > 200) {
            newErrors.description = "La descripción no puede tener más de 200 caracteres";
        }

        if (!price.trim()) {
            newErrors.price = "El precio es obligatorio";
        } else if (Number.isNaN(numericPrice) || numericPrice <= 0) {
            newErrors.price = "El precio tiene que ser mayor a cero";
        }

        if (!image.trim()) {
            newErrors.image = "La imagen es obligatoria";
        } else {
            try {
                new URL(image.trim());
            } catch {
                newErrors.image = "La imagen debe ser una URL válida";
            }
        }

        if (getParsedTags().length === 0) {
            newErrors.tags = "Añade al menos un tag";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setIsUploadingImage(true);
            setErrors((prevErrors) => ({
                ...prevErrors,
                image: undefined,
                general: undefined,
            }));

            const uploadedImageUrl = await uploadAdvertImage(file);

            setImage(uploadedImageUrl);
            setSelectedImageName(file.name);
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                image:
                    error instanceof Error
                        ? error.message
                        : "No se ha podido subir la imagen",
            }));

            setSelectedImageName("");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);
            setErrors({});

            await createAdvert({
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                isSale,
                image: image.trim(),
                tags: getParsedTags(),
            });

            navigate("/");
        } catch (error) {
            setErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : "No se ha podido crear el anuncio",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="text-sm font-medium text-[#00bba7] hover:underline"
                    >
                        Volver a los anuncios
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                        Crear un anuncio
                    </h1>

                    <p className="mt-2 text-base text-gray-600">
                        Publica un anuncio de venta o búsqueda
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    noValidate
                >
                    {errors.general && (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.general}
                        </p>
                    )}

                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Nombre del artículo
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    name: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Ej. Bicicleta Orbea de montaña"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => {
                                setDescription(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    description: undefined,
                                    general: undefined,
                                }));
                            }}
                            rows={5}
                            maxLength={200}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.description ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Describe el estado, detalles importantes y cualquier información útil."
                        />
                        <div className="mt-1 flex items-center justify-between">
                            {errors.description ? (
                                <p className="text-xs text-red-500">
                                    {errors.description}
                                </p>
                            ) : (
                                <span />
                            )}
                            <p className="text-xs text-gray-400">
                                {description.length}/200
                            </p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <span className="mb-2 block text-sm font-medium text-gray-700">
                            Tipo de anuncio
                        </span>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <label
                                className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors ${isSale
                                    ? "border-[#00bba7] bg-[#00bba7]/10 text-[#007f75]"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-[#00bba7]"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="advertType"
                                    checked={isSale}
                                    onChange={() => setIsSale(true)}
                                    className="sr-only"
                                />
                                <span className="block font-semibold">Se vende</span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    Quiero vender este artículo
                                </span>
                            </label>

                            <label
                                className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors ${!isSale
                                    ? "border-[#00bba7] bg-[#00bba7]/10 text-[#007f75]"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-[#00bba7]"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="advertType"
                                    checked={!isSale}
                                    onChange={() => setIsSale(false)}
                                    className="sr-only"
                                />
                                <span className="block font-semibold">Se busca</span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    Estoy buscando este artículo
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="price"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Precio
                        </label>
                        <input
                            id="price"
                            type="number"
                            min="1"
                            step="1"
                            value={price}
                            onChange={(event) => {
                                setPrice(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    price: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.price ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Ej. 120"
                        />
                        {errors.price && (
                            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">
                                Imagen del anuncio
                            </label>

                            <div className="mt-2 space-y-3">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageFileChange}
                                    disabled={isLoading || isUploadingImage}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#00bba7] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#009689] disabled:cursor-not-allowed disabled:bg-gray-100"
                                />

                                {isUploadingImage && (
                                    <p className="text-sm text-gray-600">Subiendo imagen...</p>
                                )}

                                {selectedImageName && !isUploadingImage && (
                                    <p className="text-sm text-green-700">
                                        Imagen subida: {selectedImageName}
                                    </p>
                                )}

                                <div>
                                    <label
                                        htmlFor="image"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        O pega una URL de imagen
                                    </label>

                                    <input
                                        id="image"
                                        type="url"
                                        value={image}
                                        onChange={(event) => {
                                            setImage(event.target.value);
                                            setSelectedImageName("");
                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                image: undefined,
                                                general: undefined,
                                            }));
                                        }}
                                        disabled={isLoading || isUploadingImage}
                                        className={`mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100 ${errors.image ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="https://res.cloudinary.com/..."
                                    />
                                </div>

                                {image && !errors.image && (
                                    <div className="overflow-hidden rounded-md border border-gray-200">
                                        <img
                                            src={image}
                                            alt="Vista previa del anuncio"
                                            className="h-48 w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {errors.image && (
                                <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="tags"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Tags
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(event) => {
                                setTags(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    tags: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.tags ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="movil, samsung, android"
                        />
                        {errors.tags ? (
                            <p className="mt-1 text-xs text-red-500">{errors.tags}</p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-400">
                                Separa los tags con comas
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isUploadingImage}
                        className="w-full rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isUploadingImage
                            ? "Subiendo imagen..."
                            : isLoading
                                ? "Creando anuncio..."
                                : "Crear anuncio"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default CreateAdvertPage;
