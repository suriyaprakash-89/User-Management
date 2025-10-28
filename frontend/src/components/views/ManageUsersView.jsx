import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../SearchBar";
import UserGrid from "../UserGrid";
import SavedSearches from "../SavedSearches";
import Pagination from "../Pagination";
import { fetchUsers } from "../../api";
import { BookmarkIcon } from "@heroicons/react/24/solid";

const PAGE_SIZE = 6;

const ManageUsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    sortBy: "created_at",
    sortOrder: "DESC",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  const loadUsers = useCallback(async (currentFilters, page) => {
    setLoading(true);
    setError("");
    try {
      const activeFilters = Object.entries(currentFilters).reduce(
        (acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        },
        {}
      );
      const params = { ...activeFilters, page, limit: PAGE_SIZE };
      const response = await fetchUsers(params);
      setUsers(response.data.users);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(filters, currentPage);
  }, [filters, currentPage, loadUsers]);

  const handleFilterChange = (newFilters) => {
    const defaultFilters = {
      name: "",
      age: "",
      gender: "",
      location: "",
      sortBy: "created_at",
      sortOrder: "DESC",
    };
    setFilters({ ...defaultFilters, ...newFilters });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 pb-24 lg:pb-0">
          <SearchBar onSearch={handleFilterChange} initialFilters={filters} />
          <div className="px-2 rounded-xl shadow-sm">
            <UserGrid users={users} loading={loading} error={error} />
          </div>
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <SavedSearches
            onApply={handleFilterChange}
            currentFilters={filters}
          />
        </div>
      </div>
      <div className="block lg:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-20 bg-slate-800 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <BookmarkIcon className="h-6 w-6" />
        </motion.button>
      </div>
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-30"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-40"
            >
              <SavedSearches
                onApply={handleFilterChange}
                currentFilters={filters}
                isMobileView={true}
                closeDrawer={() => setIsDrawerOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ManageUsersView;
