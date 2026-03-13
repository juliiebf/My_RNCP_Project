type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2" style={{ marginTop: '20px' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed" style={{ padding: '2px 12px' }}
      >
        ← Précédent
      </button>

      <div className="flex gap-2">
        {[...Array(Math.min(totalPages, 5))].map((_, index) => {
          let page: number;
          if (totalPages <= 5) {
            page = index + 1;
          } else if (currentPage <= 3) {
            page = index + 1;
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + index;
          } else {
            page = currentPage - 2 + index;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{ padding: '2px 12px' }}
              className={`rounded-lg font-medium transition text-md ${
                currentPage === page
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className=" bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed" style={{ padding: '2px 12px' }}
      >
        Suivant →
      </button>

      <span className="ml-4 text-gray-400">
        Page {currentPage} sur {totalPages}
      </span>
    </div>
  );
}