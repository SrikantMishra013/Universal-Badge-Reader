import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import DetailRow from "../components/DeailRow";

interface Visitor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  company: string;
  ocrText: string;
  aiSummary?: string;
  createdAt?: string;
}

export default function VisitorDetailsPage() {
  const { id } = useParams();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchVisitor(id);
  }, [id]);

  const fetchVisitor = async (visitorId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/visitor/${visitorId}`
      );
      const visitor = res.data as Visitor;
      setVisitor(visitor);
      if (visitor.aiSummary) setSummary(visitor.aiSummary);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to fetch visitor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrich = async () => {
    if (!visitor?._id) return;
    setSummarizing(true);
    try {
      const res = await axios.post<{ summary: string }>(
        `http://localhost:5000/api/visitor/${visitor._id}/enrich`
      );
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Failed to enrich visitor.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleFollowUp = async () => {
    if (!visitor?.email) return alert("Visitor has no email");
    try {
      await axios.post(
        `http://localhost:5000/api/visitor/${visitor._id}/email`
      );
      alert("✅ Follow-up email sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-blue-600 text-lg font-medium">
        <svg
          className="w-6 h-6 mr-2 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
          />
        </svg>
        Loading visitor...
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!visitor)
    return <div className="p-4 text-gray-700">Visitor not found.</div>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">
            👤 Visitor Details
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            ID: <code>{visitor._id}</code>
          </p>
        </header>

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-3 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📇 Visitor Info
            </h2>
            <DetailRow label="Name" value={visitor.name} />
            <DetailRow label="Company" value={visitor.company} />
            <DetailRow label="Email" value={visitor.email} />
            <DetailRow label="Mobile" value={visitor.mobile} />
          </div>

          {/* AI Summary + Follow-up */}
          <div className="bg-white shadow rounded-lg p-6 space-y-6 border">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                ⚙️ AI Summary
              </h2>

              {summary ? (
                <>
                  <div className="bg-green-50 border border-green-300 p-3 rounded text-sm mb-3">
                    {summary}
                  </div>
                  <button
                    onClick={handleEnrich}
                    disabled={summarizing}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded shadow-sm transition"
                  >
                    {summarizing ? "⏳ Regenerating..." : "🔁 Retry Summary"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEnrich}
                  disabled={summarizing}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded shadow-sm transition"
                >
                  {summarizing ? "⏳ Enriching..." : "🔍 Run AI Summary"}
                </button>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                📨 Follow-Up
              </h2>
              <button
                onClick={handleFollowUp}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition w-full"
              >
                ✉️ Send Follow-Up Email
              </button>
            </div>
          </div>
        </section>

        {/* OCR Text Section */}
        <section className="bg-gray-50 rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🧾 OCR Raw Text
          </h2>
          <pre className="text-sm whitespace-pre-wrap text-gray-700">
            {visitor.ocrText}
          </pre>
        </section>
      </div>
    </Layout>
  );
}
