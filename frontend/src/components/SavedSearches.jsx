import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { saveSearch, fetchSavedSearches, deleteSearch } from "../api";
import {
  BookmarkSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const SavedSearches = ({
  onApply,
  currentFilters,
  isMobileView = false,
  closeDrawer,
}) => {
  const [searches, setSearches] = useState([]);
  const [searchName, setSearchName] = useState("");

  const loadSearches = async () => {
    try {
      const response = await fetchSavedSearches();
      setSearches(response.data);
    } catch (err) {
      console.error("Failed to load saved searches", err);
    }
  };
  useEffect(() => {
    loadSearches();
  }, []);

  const handleApply = (filters) => {
    onApply(filters);
    if (isMobileView) {
      closeDrawer();
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!searchName) {
      toast.error("Please provide a name for the search.");
      return;
    }
    const filtersToSave = Object.entries(currentFilters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );
    if (Object.keys(filtersToSave).length === 0) {
      toast.error("Cannot save an empty search. Apply filters first.");
      return;
    }
    try {
      await saveSearch({ name: searchName, filters: filtersToSave });
      toast.success(`Search "${searchName}" saved!`);
      setSearchName("");
      loadSearches();
    } catch (err) {
      toast.error("Failed to save search.");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteSearch(id);
      toast.success("Search deleted.");
      loadSearches();
    } catch (err) {
      toast.error("Failed to delete search.");
    }
  };
  const containerClasses = isMobileView
    ? "bg-white p-6 rounded-t-2xl shadow-2xl space-y-4"
    : "bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 sticky top-24";

  return (
    <div className={containerClasses}>
      {isMobileView && (
        <div className="flex justify-center items-center relative pb-2 border-b border-slate-200">
          {" "}
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />{" "}
          <button
            onClick={closeDrawer}
            className="absolute right-0 top-0 text-slate-500 hover:text-slate-800"
          >
            {" "}
            <XMarkIcon className="h-6 w-6" />{" "}
          </button>{" "}
        </div>
      )}
      <div className="flex items-center space-x-2">
        {" "}
        <BookmarkSquareIcon className="h-6 w-6 text-indigo-600" />{" "}
        <h2 className="text-xl font-semibold text-slate-800">Saved Searches</h2>{" "}
      </div>
      <form onSubmit={handleSave} className="space-y-2">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Save current filters..."
          className="w-full p-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400"
        />
        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
        >
          {" "}
          <ArrowDownTrayIcon className="h-5 w-5" /> <span>Save Search</span>{" "}
        </button>
      </form>
      <div className="border-t border-slate-200 pt-4">
        
        <motion.ul layout className="space-y-2 max-h-60 overflow-y-auto">
          {searches.length > 0 ? (
            searches.map((search) => (
              <motion.li
                key={search.id}
                className="flex justify-between items-center p-2 rounded-lg"
                layout="position"
              >
                <span className="font-medium text-slate-600">
                  {search.name}
                </span>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Apply Search"
                    onClick={() => handleApply(search.filters)}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Search"
                    onClick={() => handleDelete(search.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.li>
            ))
          ) : (
            <p className="text-sm text-center text-slate-500 py-4">
              No saved searches yet.
            </p>
          )}
        </motion.ul>
      </div>
    </div>
  );
};
export default SavedSearches;
