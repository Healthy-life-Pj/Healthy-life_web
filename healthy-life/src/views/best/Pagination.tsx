import React from 'react';
import '../../style/home/productList.css'


interface paginationProps {
  currentPage: number;
  totalProducts: number;
  bestItemPerPage: number;
  paginate: (pageNumber: number) => void;

}

const Pagination: React.FC<paginationProps> = ({currentPage, totalProducts, bestItemPerPage, paginate}) =>{
    const pageNumbers = [];
    const totalPages  = Math.ceil(totalProducts / bestItemPerPage);
    const maxPageGroup = Math.ceil(currentPage / 3);
    const currentPageGroup = Math.ceil(currentPage / 3);
    const startPage = (currentPageGroup - 1) * 3 + 1;
    const endPage = Math.min(currentPageGroup * 3, totalPages);

    for (let i = startPage; i <= endPage; i++){
      pageNumbers.push(i);
    }


  return(
    <div className="productPagination1">
    {startPage > 1 && (
      <div className="productPageItem1">
      <button onClick={() => paginate(startPage -3)} className="PageLinkdirection1 pageLink1">
        Previous
      </button>
      </div>)}

      {pageNumbers.map(number => (
        <div key={number} className={`pageItem1 ${number === currentPage ? 'active' : ''}`}>
          <button onClick={() => paginate(number)} className="productPageLink1 pageLink1">{number}</button>
        </div>
      ))}

      {endPage < totalPages && (
        <div className="pageItem1">
          <button onClick={() => paginate(startPage + 3)} className="PageLinkdirection1 pageLink1">Next</button>

        </div>
      )}


    </div>
  )

}



export default Pagination;