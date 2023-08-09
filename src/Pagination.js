import React from 'react';

import "./Pagination.css"

const Pagination = ({ currentPage, totalPages, onNextPage, onPrevPage }) => {
  return (
    <div className="pagination">
      <button className='button' onClick={onPrevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>{currentPage}</span>
      <button className='button' onClick={onNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
