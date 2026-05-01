import "../style/home/SmallPagination.css";

export interface PaginationProps {
  productPerPage: number;
  totalProducts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const SmallPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalProducts,
  productPerPage,
  paginate,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalProducts / productPerPage);
  const currentPageGroup = Math.ceil(currentPage / 3);
  const startPage = (currentPageGroup - 1) * 3 + 1;
  const endPage = Math.min(currentPageGroup * 3, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="productSmallPagination">
      {startPage > 1 && (
        <div className="productPageItem">
          <button
            onClick={() => paginate(startPage - 3)}
            className="smallPageLinkdirection smallPageLink"
          >
            Previous
          </button>
        </div>
      )}

      {pageNumbers.map((number) => (
        <div
          key={number}
          className={`smallPageItem ${number === currentPage ? "active" : ""}`}
        >
          <button
            onClick={() => paginate(number)}
            className="productSmallPageLink smallPageLink"
          >
            {number}
          </button>
        </div>
      ))}

      {endPage < totalPages && (
        <div className="smallPageItem">
          <button
            onClick={() => paginate(endPage + 1)}
            className="smallPageLinkdirection smallPageLink"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default SmallPagination;
