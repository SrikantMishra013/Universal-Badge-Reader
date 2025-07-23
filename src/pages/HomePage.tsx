import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        🎴 Universal Card Reader
      </h1>

      <p className="text-gray-600 text-lg text-center mb-10 max-w-xl">
        Scan badges, read business cards, and instantly enrich and follow up
        with visitors — powered by AI and OCR.
      </p>

      <div className="flex gap-4">
        <Link
          to="/scan"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          🔍 Scan Visitor
        </Link>

        <Link
          to="/visitors"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          👥 View All Visitors
        </Link>
      </div>
    </div>
  );
}
