import React from "react";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  DocumentMinusIcon,
} from "@heroicons/react/24/outline";

const getInitials = (name) => {
  if (!name) return "?";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};
const professionalColors = [
  "bg-sky-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-slate-600",
];
const getColorFromName = (name) => {
  if (!name) return professionalColors[0];
  const charCodeSum = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return professionalColors[charCodeSum % professionalColors.length];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}; // Slightly faster stagger
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const UserCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
    {" "}
    <div className="flex items-center space-x-4">
      {" "}
      <Skeleton circle height={48} width={48} />{" "}
      <div className="w-full space-y-2">
        {" "}
        <Skeleton height={20} width="60%" />{" "}
        <Skeleton height={14} width="80%" />{" "}
      </div>{" "}
    </div>{" "}
  </div>
);

const UserCard = ({ user }) => (
  <motion.div
    variants={cardVariants}
    // --- HIGH-PERFORMANCE HOVER ANIMATION ---
    // We only animate scale (transform) and let CSS handle the border color. No shadow animation.
    whileHover={{
      scale: 1.03,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    }}
    className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 transition-colors duration-200 p-4 flex items-center space-x-4 cursor-pointer"
  >
    <div
      className={`w-12 h-12 rounded-full flex-shrink-0 ${getColorFromName(
        user.name
      )} flex items-center justify-center`}
    >
      <span className="text-white text-xl font-bold">
        {getInitials(user.name)}
      </span>
    </div>
    <div className="w-full flex-1">
      <h3 className="font-bold text-lg text-slate-800 truncate">{user.name}</h3>
      <p className="text-sm text-indigo-600 flex items-center space-x-2 truncate">
        <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
        <span>{user.email}</span>
      </p>
      <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
        <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center space-x-1.5">
          <PhoneIcon className="h-4 w-4" />
          <span>{user.contact_number}</span>
        </span>
        <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center space-x-1.5">
          <UserIcon className="h-4 w-4" />
          <span>Age: {user.age}</span>
        </span>
        <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full flex items-center space-x-1.5">
          <MapPinIcon className="h-4 w-4" />
          <span>{user.location}</span>
        </span>
      </div>
    </div>
  </motion.div>
);

const UserGrid = ({ users, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        {Array.from({ length: 6 }).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}{" "}
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 text-red-700 font-semibold rounded-lg shadow-sm">
        {error}
      </div>
    );
  }
  if (users.length === 0) {
    return (
      <div className="text-center p-16 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500">
        {" "}
        <DocumentMinusIcon className="h-12 w-12 mx-auto text-slate-400 mb-2" />{" "}
        <h3 className="text-lg font-semibold">No Results Found</h3>{" "}
        <p>Try adjusting your search filters.</p>{" "}
      </div>
    );
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {" "}
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}{" "}
    </motion.div>
  );
};

export default UserGrid;
