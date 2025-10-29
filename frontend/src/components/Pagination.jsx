import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) { return null; }
  const handlePrev = () => { if (currentPage > 1) { onPageChange(currentPage - 1); } };
  const handleNext = () => { if (currentPage < totalPages) { onPageChange(currentPage + 1); } };
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm border border-slate-200 mt-6">
      <div> <p className="text-sm text-slate-700"> Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> </p> </div>
      <div className="flex items-center space-x-2">
        <button onClick={handlePrev} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeftIcon className="h-5 w-5 mr-1"/> Previous
        </button>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Next <ChevronRightIcon className="h-5 w-5 ml-1"/>
        </button>
      </div>
    </div>
  );
};
export default Pagination;