import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import VisitorDetailsPage from "./pages/VisitorDetailsPage";
import VisitorListPage from "./pages/VisitorListPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/visitor/:id" element={<VisitorDetailsPage />} />
        <Route path="/visitors" element={<VisitorListPage />} />
      </Routes>
    </Router>
  );
}
