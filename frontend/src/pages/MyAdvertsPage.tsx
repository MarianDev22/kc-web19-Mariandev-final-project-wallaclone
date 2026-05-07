import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdvertCard from "../components/adverts/AdvertCard";
import { getMyAdverts, type Advert } from "../services/advertService";
import { deleteAdvert } from "../services/deleteAdvertService";

const ADVERTS_PER_PAGE = 12;

function MyAdvertsPage() {
    const navigate = useNavigate();

    const [adverts, setAdverts] = useState<Advert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAdverts, setTotalAdverts] = useState(0);
    const [deletingAdvertId, setDeletingAdvertId] = useState<string | null>(null);

    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage * ADVERTS_PER_PAGE < totalAdverts;
    const totalPages = Math.ceil(totalAdverts / ADVERTS_PER_PAGE);

    const loadMyAdverts = useCallback(
        async (pageToLoad = 1) => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage("");
                setSuccessMessage("");

                const data = await getMyAdverts({
                    limit: ADVERTS_PER_PAGE,
                    page: pageToLoad,
                });

                setAdverts(data.content);
                setTotalAdverts(data.total);
                setCurrentPage(data.page);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "No se han podido cargar tus anuncios",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [navigate],
    );

    useEffect(() => {
        void loadMyAdverts(1);
    }, [loadMyAdverts]);

    function handlePreviousPage() {
        if (!hasPreviousPage) {
            return;
        }

        void loadMyAdverts(currentPage - 1);
    }

    function handleNextPage() {
        if (!hasNextPage) {
            return;
        }

        void loadMyAdverts(currentPage + 1);
    }

    async function handleDeleteAdvert(advertId: string) {
        const shouldDelete = window.confirm(
            "¿Seguro que quieres eliminar este anuncio? Esta acción no se puede deshacer.",
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingAdvertId(advertId);
            setErrorMessage("");
            setSuccessMessage("");

            await deleteAdvert(advertId);

            const nextTotalAdverts = Math.max(totalAdverts - 1, 0);
            const shouldGoToPreviousPage =
                adverts.length === 1 && currentPage > 1 && nextTotalAdverts > 0;

            if (shouldGoToPreviousPage) {
                await loadMyAdverts(currentPage - 1);
            } else {
                setAdverts((currentAdverts) =>
                    currentAdverts.filter((advert) => advert.id !== advertId),
                );
                setTotalAdverts(nextTotalAdverts);
            }

            setSuccessMessage("Anuncio eliminado correctamente");
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "No se ha podido eliminar el anuncio",
            );
        } finally {
            setDeletingAdvertId(null);
        }
    }

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Mis anuncios
                        </h1>
                        <p className="mt-2 text-base text-gray-600">
                            Gestiona los anuncios que has publicado
                        </p>
                    </div>

                    <Link
                        to="/adverts/new"
                        className="inline-flex items-center justify-center rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                    >
                        Crear anuncio
                    </Link>
                </div>

                {successMessage && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                        {successMessage}
                    </div>
                )}

                {isLoading && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Cargando tus anuncios...
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !errorMessage && adverts.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Todavía no has publicado ningún anuncio
                    </div>
                )}

                {!isLoading && !errorMessage && adverts.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {adverts.map((advert) => (
                                <div key={advert.id} className="space-y-3">
                                    <AdvertCard advert={advert} />

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            to={`/adverts/${advert.id}/edit`}
                                            state={{ advert }}
                                            className="inline-flex items-center justify-center rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                                        >
                                            Editar
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => void handleDeleteAdvert(advert.id)}
                                            disabled={deletingAdvertId === advert.id}
                                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deletingAdvertId === advert.id
                                                ? "Eliminando..."
                                                : "Eliminar"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
                            <p className="text-sm text-gray-600">
                                Página {currentPage}
                                {totalPages > 0 ? ` de ${totalPages}` : ""} · {totalAdverts}{" "}
                                anuncios
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={!hasPreviousPage || isLoading}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Más recientes
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage || isLoading}
                                    className="rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Más antiguos
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default MyAdvertsPage;
