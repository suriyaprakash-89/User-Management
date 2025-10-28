import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowDownOnSquareIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { API_BASE_URL } from "../api";

const genderOptions = [
  { name: "All Genders", value: "" },
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" },
  { name: "Other", value: "Other" },
];
const sortByOptions = [
  { name: "Sort by Date", value: "created_at" },
  { name: "Sort by Name", value: "name" },
  { name: "Sort by Age", value: "age" },
];
const sortOrderOptions = [
  { name: "Descending", value: "DESC" },
  { name: "Ascending", value: "ASC" },
];

const SearchBar = ({ onSearch, initialFilters }) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    if (name === "sortBy" || name === "sortOrder" || name === "gender") {
      onSearch(newFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(localFilters);
  };
  const handleClear = () => {
    const cleared = {
      name: "",
      age: "",
      gender: "",
      location: "",
      sortBy: "created_at",
      sortOrder: "DESC",
    };
    setLocalFilters(cleared);
    onSearch(cleared);
  };
  const handleExport = () => {
    const activeFilters = Object.entries(localFilters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );
    const query = new URLSearchParams(activeFilters).toString();
    const exportUrl = `${API_BASE_URL}/users/export?${query}`;
    window.open(exportUrl, "_blank");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              name="name"
              placeholder="Search by name, email, or location..."
              value={localFilters.name}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, name: e.target.value })
              }
              className="w-full p-2.5 pl-10 border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
          </div>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={localFilters.age}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, age: e.target.value })
            }
            className="w-full p-2.5 border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400"
          />

          <Listbox
            value={localFilters.gender}
            onChange={(value) => handleFilterChange("gender", value)}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                <span className="block truncate">
                  {
                    genderOptions.find((o) => o.value === localFilters.gender)
                      ?.name
                  }
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                  {genderOptions.map((option) => (
                    <Listbox.Option
                      key={option.name}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-slate-100 text-slate-900"
                            : "text-gray-900"
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 pt-4">
          <div className="flex w-full md:w-auto items-center gap-4">
            <Listbox
              value={localFilters.sortBy}
              onChange={(value) => handleFilterChange("sortBy", value)}
            >
              <div className="relative w-full">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                  <span className="block truncate">
                    {
                      sortByOptions.find((o) => o.value === localFilters.sortBy)
                        ?.name
                    }
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                    {sortByOptions.map((option) => (
                      <Listbox.Option
                        key={option.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-slate-100 text-slate-900"
                              : "text-gray-900"
                          }`
                        }
                        value={option.value}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {option.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            <Listbox
              value={localFilters.sortOrder}
              onChange={(value) => handleFilterChange("sortOrder", value)}
            >
              <div className="relative w-full">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                  <span className="block truncate">
                    {
                      sortOrderOptions.find(
                        (o) => o.value === localFilters.sortOrder
                      )?.name
                    }
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                    {sortOrderOptions.map((option) => (
                      <Listbox.Option
                        key={option.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-slate-100 text-slate-900"
                              : "text-gray-900"
                          }`
                        }
                        value={option.value}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {option.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="flex w-full md:w-auto items-center space-x-2">
            <button
              type="button"
              onClick={handleClear}
              className="w-full justify-center flex items-center space-x-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
            >
              <XMarkIcon className="h-5 w-5" /> <span>Clear</span>
            </button>
            <button
              type="submit"
              className="w-full justify-center flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors font-semibold"
            >
              <MagnifyingGlassIcon className="h-5 w-5" /> <span>Search</span>
            </button>
          </div>
        </div>
        <div className="flex justify-center border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            <ArrowDownOnSquareIcon className="h-5 w-5" />{" "}
            <span>Export Current Results to CSV</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default SearchBar;
