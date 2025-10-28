import React from "react";
import DashboardPage from "./pages/DashboardPage";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <img src="/FSYS_logo.png" alt="Fluxion Logo" className="h-10" />
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
          <DashboardPage />
        </div>
      </main>
    </div>
  );
}
export default App;
