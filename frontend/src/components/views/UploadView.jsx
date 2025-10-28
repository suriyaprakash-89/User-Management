import React, { useState, useCallback } from "react";
import { uploadFile } from "../../api";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const clearState = () => {
    setFile(null);
    setUploadResult(null);
  };

  const handleFileChange = (e) => {
    clearState();
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
    clearState();
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

    const toastId = toast.loading("Uploading and processing file...");
    setUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData);
      const { insertedCount, duplicates } = response.data;

      toast.dismiss(toastId);
      toast.success(`${insertedCount} user(s) imported successfully.`);

      setUploadResult({ insertedCount, duplicates });

      onUploadSuccess();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-2 text-slate-800">
        Import Users from Excel
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Select a .xlsx or .xls file. The system will automatically detect and
        skip duplicate entries.
      </p>

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
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-slate-400" />
            <span className="mt-2 block font-semibold text-slate-600">
              Drag & drop a file here or{" "}
              <span className="text-indigo-600">click to browse</span>
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Supported formats: XLSX, XLS
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
            className="flex items-center justify-between p-3 bg-slate-100 rounded-lg border border-slate-200"
          >
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-slate-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 truncate">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={clearState}
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
          className="w-full flex justify-center items-center space-x-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          <span>{uploading ? "Processing..." : "Upload & Import"}</span>
        </motion.button>
      </form>

      {uploadResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 border-t border-slate-200 pt-4"
        >
          <h3 className="text-lg font-semibold text-slate-800">
            Import Summary
          </h3>
          <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <p className="font-semibold text-green-800">
                {uploadResult.insertedCount} user(s) imported successfully.
              </p>
            </div>
          </div>
          {uploadResult.duplicates && uploadResult.duplicates.length > 0 && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <details open>
                <summary className="font-semibold text-amber-800 cursor-pointer flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
                  <span>
                    {uploadResult.duplicates.length} duplicate(s) were found and
                    skipped.
                  </span>
                </summary>
                <ul className="mt-3 pl-8 text-sm text-slate-600 list-disc space-y-1">
                  {uploadResult.duplicates.map((dup, index) => (
                    <li key={index}>
                      <span className="font-medium">{dup.Name}</span> (
                      {dup.Email || dup.ContactNumber})
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const UploadView = ({ onUploadSuccess }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <FileUpload onUploadSuccess={onUploadSuccess} />
    </div>
  );
};

export default UploadView;
