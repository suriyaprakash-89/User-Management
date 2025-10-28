import React, { useState, useCallback } from "react";
import { uploadFile } from "../../api";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = useCallback((e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const toastId = toast.loading("Uploading file...");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData);
      const { insertedCount, duplicates } = response.data;

      toast.dismiss(toastId);
      toast.success(`${insertedCount} user(s) imported successfully.`);
      if (duplicates && duplicates.length > 0) {
        setTimeout(
          () =>
            toast(`${duplicates.length} duplicate(s) were skipped.`, {
              icon: "⚠️",
            }),
          1000
        );
      }

      onUploadSuccess();
      setFile(null);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Import Users
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="file-upload"
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDrop={handleDrop}
          className={`relative block w-full p-8 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 hover:border-indigo-400"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-slate-400" />
            <span className="mt-2 block font-semibold text-slate-600">
              Drag & drop a file here or
              <span className="text-indigo-600">click to upload</span>
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              XLSX or XLS file
            </span>
          </div>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="sr-only"
          />
        </label>

        {file && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-slate-100 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-6 w-6 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-slate-500 hover:text-red-500"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={uploading || !file}
          className="w-full flex justify-center items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          <span>{uploading ? "Processing..." : "Upload & Import"}</span>
        </motion.button>
      </form>
    </div>
  );
};

export default FileUpload;
