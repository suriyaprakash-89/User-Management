import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm border border-gray-200/50 mt-6"
    >
      {/* Info */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-semibold text-gray-900">{startItem}</span>{" "}
        to <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
        results
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"
          }`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </motion.button>

        {/* Page Numbers */}
        <div className="hidden md:flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                1
              </motion.button>
              {pageNumbers[0] > 2 && (
                <span className="text-gray-400 px-1">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: page === currentPage ? 1 : 1.05 }}
              whileTap={{ scale: page === currentPage ? 1 : 0.95 }}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                page === currentPage
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </motion.button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="text-gray-400 px-1">...</span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {totalPages}
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Page Indicator */}
        <div className="md:hidden flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold shadow-md">
          {currentPage} / {totalPages}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Pagination;
