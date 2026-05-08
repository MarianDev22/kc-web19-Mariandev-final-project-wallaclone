import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdvertCard from "../components/adverts/AdvertCard";
import { getAdverts, type Advert } from "../services/advertService";

const ADVERTS_PER_PAGE = 12;

function MemberAdvertsPage() {
    const { username } = useParams<{ username: string }>();
    const [adverts, setAdverts] = useState<Advert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAdverts, setTotalAdverts] = useState(0);

    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage * ADVERTS_PER_PAGE < totalAdverts;
    const totalPages = Math.ceil(totalAdverts / ADVERTS_PER_PAGE);

    const loadMemberAdverts = useCallback(
        async (pageToLoad = 1) => {
            if (!username) {
                setErrorMessage("No se ha podido identificar el miembro");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage("");

                const data = await getAdverts({
                    username,
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
                        : "No se han podido cargar los anuncios del miembro",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [username],
    );

    useEffect(() => {
        void loadMemberAdverts(1);
    }, [loadMemberAdverts]);

    function handlePreviousPage() {
        if (!hasPreviousPage) {
            return;
        }

        void loadMemberAdverts(currentPage - 1);
    }

    function handleNextPage() {
        if (!hasNextPage) {
            return;
        }

        void loadMemberAdverts(currentPage + 1);
    }

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Anuncios de {username}
                    </h1>
                    <p className="mt-2 text-base text-gray-600">
                        Últimos anuncios publicados por este miembro
                    </p>
                </div>

                {isLoading && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Cargando anuncios...
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !errorMessage && adverts.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Este miembro todavía no tiene anuncios publicados
                    </div>
                )}

                {!isLoading && !errorMessage && adverts.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {adverts.map((advert) => (
                                <AdvertCard key={advert.id} advert={advert} />
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
                            <p className="text-sm text-gray-600">
                                Página {currentPage}
                                {totalPages > 0 ? ` de ${totalPages}` : ""} ·{" "}
                                {totalAdverts} anuncios
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={!hasPreviousPage}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Más recientes
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage}
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

export default MemberAdvertsPage;
