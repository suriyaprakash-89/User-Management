import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManageUsersView from "../components/views/ManageUsersView";
import UploadView from "../components/views/UploadView";
import { UsersIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const tabs = [
  { id: "upload", label: "Upload Data", icon: ArrowUpTrayIcon },
  { id: "manage", label: "Manage Users", icon: UsersIcon }
  
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [refreshKey, setRefreshKey] = useState(0);
  const handleUploadSuccess = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center border-b border-slate-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              } group relative inline-flex items-center gap-2 whitespace-nowrap py-4 px-1 text-sm font-medium transition`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.span
                  layoutId="underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
          ))}
        </nav>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "manage" && <ManageUsersView key={refreshKey} />}
          {activeTab === "upload" && (
            <UploadView onUploadSuccess={handleUploadSuccess} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default DashboardPage;
