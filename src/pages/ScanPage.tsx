import { useState } from "react";
import Tesseract from "tesseract.js";
import { parseOCRText } from "../utils/parseOCRText";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setOcrText("");
    setError("");
  };

  const handleScan = () => {
    if (!imageFile) return;
    setIsLoading(true);

    Tesseract.recognize(imageFile, "eng", {
      // logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setOcrText(text);
        const parsed = parseOCRText(text);
        console.log(parsed);

        sendToBackend(parsed);
      })
      .catch((err) => {
        console.error("OCR Error:", err);
        setError("Failed to scan. Try a clearer image.");
        setIsLoading(false);
      });
  };

  const sendToBackend = async (parsed: {
    name: string;
    email: string;
    company: string;
    mobile: string;
    raw: string;
  }) => {
    try {
      interface VisitorResponse {
        _id: string;
        [key: string]: any;
      }
      const res = await axios.post<VisitorResponse>(
        "http://localhost:5000/api/visitor",
        {
          name: parsed.name,
          company: parsed.company,
          email: parsed.email,
          mobile: parsed.mobile,
          ocrText: parsed.raw,
        }
      );
      const newVisitorId = res.data._id;
      navigate(`/visitor/${newVisitorId}`);
    } catch (err) {
      console.error("Backend Error:", err);
      setError("Failed to save visitor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">📷 Scan Badge / Card</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full border rounded px-3 py-2"
      />

      <button
        disabled={!imageFile || isLoading}
        onClick={handleScan}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? "Scanning..." : "Start OCR Scan"}
      </button>

      {ocrText && (
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Extracted Text:</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {ocrText}
          </pre>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}
    </div>
  );
}
