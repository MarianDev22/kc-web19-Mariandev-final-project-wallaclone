type PaginationProps = {
    currentPage: number;
    totalPages: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
};

type PaginationItem = number | "ellipsis";

function getVisiblePages(
    currentPage: number,
    totalPages: number,
): PaginationItem[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

function Pagination({
    currentPage,
    totalPages,
    isLoading = false,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const pages = getVisiblePages(currentPage, totalPages);

    return (
        <nav
            className="mt-8 flex justify-center"
            aria-label="Paginación de anuncios"
        >
            <ul className="inline-flex -space-x-px text-sm">
                <li>
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPreviousPage || isLoading}
                        className="flex h-10 min-w-10 items-center justify-center rounded-s-lg border border-teal-200 bg-white px-4 leading-tight text-teal-700 hover:bg-teal-50 hover:text-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Página anterior"
                    >
                        ‹
                    </button>
                </li>

                {pages.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <li key={`ellipsis-${index}`}>
                                <span className="flex h-10 min-w-10 items-center justify-center border border-teal-200 bg-white px-4 leading-tight text-teal-700">
                                    ...
                                </span>
                            </li>
                        );
                    }

                    const isCurrentPage = page === currentPage;

                    return (
                        <li key={page}>
                            <button
                                type="button"
                                onClick={() => onPageChange(page)}
                                disabled={isCurrentPage || isLoading}
                                aria-current={isCurrentPage ? "page" : undefined}
                                className={
                                    isCurrentPage
                                        ? "flex h-10 min-w-10 items-center justify-center border border-teal-600 bg-teal-600 px-4 leading-tight text-white"
                                        : "flex h-10 min-w-10 items-center justify-center border border-teal-200 bg-white px-4 leading-tight text-teal-700 hover:bg-teal-50 hover:text-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                                }
                            >
                                {page}
                            </button>
                        </li>
                    );
                })}

                <li>
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage || isLoading}
                        className="flex h-10 min-w-10 items-center justify-center rounded-e-lg border border-teal-200 bg-white px-4 leading-tight text-teal-700 hover:bg-teal-50 hover:text-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Página siguiente"
                    >
                        ›
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
