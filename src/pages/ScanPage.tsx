import { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseOCRText } from "../utils/parseOCRText";

// Modular Components
import Layout from "../components/Layout";
import QRScanner from "../components/QRScanner";
import ManualEntry from "../components/ManualEntry";
import VisitorPreview from "../components/VisitorPreview";

// ...same imports

export default function ScanPage() {
  const [mode, setMode] = useState<"ocr" | "qr" | "manual">("ocr");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setOcrText("");
    setError("");
    setVisitorData(null);
  };

  const handleScan = () => {
    if (!imageFile) return;
    setIsLoading(true);
    Tesseract.recognize(imageFile, "eng")
      .then(({ data: { text } }) => {
        setOcrText(text);
        const parsed = parseOCRText(text);
        setVisitorData(parsed);
      })
      .catch((err) => {
        console.error("OCR Error:", err);
        setError("❌ Failed to scan. Try a clearer image.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = async () => {
    if (!visitorData) return;
    setIsLoading(true);
    try {
      const res = await axios.post<{ _id: string }>(
        "http://localhost:5000/api/visitor",
        {
          name: visitorData.name,
          company: visitorData.company,
          email: visitorData.email,
          mobile: visitorData.mobile,
          ocrText: visitorData.raw,
        }
      );
      navigate(`/visitor/${res.data._id}`);
    } catch (err) {
      console.error("Backend Error:", err);
      setError("❌ Failed to save visitor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-800">
          🪪 Scan Visitor Info
        </h1>

        {/* Mode Selector */}
        <div className="flex space-x-4">
          {["ocr", "qr", "manual"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                mode === m
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m === "ocr" ? "📸 OCR" : m === "qr" ? "📱 QR Code" : "📝 Manual"}
            </button>
          ))}
        </div>

        {/* OCR Mode */}
        {mode === "ocr" && (
          <div className="space-y-4 animate-fade-in-slide">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Upload an image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>

            <button
              onClick={handleScan}
              disabled={!imageFile || isLoading}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded shadow hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Scanning...</span>
                </>
              ) : (
                "🔍 Start OCR Scan"
              )}
            </button>

            {ocrText && (
              <div className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Extracted Text
                </h2>
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {ocrText}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* QR Mode */}
        {mode === "qr" && (
          <div className="animate-fade-in-slide">
            <QRScanner setVisitorData={setVisitorData} />
          </div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <div className="animate-fade-in-slide">
            <ManualEntry setVisitorData={setVisitorData} />
          </div>
        )}

        {/* Preview & Submit */}
        {visitorData && (
          <VisitorPreview
            visitor={visitorData}
            onConfirm={handleSubmit}
            loading={isLoading}
          />
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded border border-red-300 shadow-sm">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
}

type VisitorData = {
  name: string;
  email: string;
  company: string;
  mobile: string;
  raw: string;
};
