import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition"
          >
            🎴 Universal Card Reader
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6 text-base font-medium">
            <Link
              to="/scan"
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              🔍 Scan
            </Link>
            <Link
              to="/visitors"
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              👥 Visitors
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center ">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © 2025 Universal Card Reader. All rights reserved.
      </footer>
    </div>
  );
}
