import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    if (!id) return;
    fetchVisitor(id);
  }, [id]);

  const fetchVisitor = async (visitorId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/visitor/${visitorId}`
      );
      setVisitor(res.data as Visitor);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch visitor.");
    } finally {
      setLoading(false);
    }
  };

  const [summary, setSummary] = useState<string>(visitor?.aiSummary || "");
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (visitor?.aiSummary) {
      setSummary(visitor.aiSummary);
    }
  }, [visitor]);

  const handleEnrich = async () => {
    setSummarizing(true);
    try {
      const res = await axios.post<{ summary: string }>(
        `http://localhost:5000/api/visitor/${visitor?._id}/enrich`
      );
      console.log(res);

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
        `http://localhost:5000/api/visitor/${visitor?._id}/email`
      );
      alert("Follow-up email sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    }
  };

  if (loading) return <div className="p-4 text-lg">Loading visitor...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!visitor) return <div className="p-4">Visitor not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">👤 Visitor Details</h1>

      <div className="bg-white shadow rounded p-4 space-y-2">
        <p>
          <strong>Name:</strong> {visitor.name}
        </p>
        <p>
          <strong>Company:</strong> {visitor.company}
        </p>
        <p>
          <strong>Email:</strong> {visitor.email}
        </p>
        <p>
          <strong>Mobile:</strong> {visitor.mobile}
        </p>
        <p>
          <strong>ID:</strong> {visitor._id}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-medium mb-2">🧾 OCR Raw Text</h2>
        <pre className="whitespace-pre-wrap">{visitor.ocrText}</pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">⚙️ Enriched Intelligence</h2>

        {summary ? (
          <div className="bg-green-50 p-3 rounded text-sm border border-green-300">
            {summary}
          </div>
        ) : (
          <button
            onClick={handleEnrich}
            disabled={summarizing}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            {summarizing ? "Enriching..." : "🔍 Run AI Summary"}
          </button>
        )}

        <h2 className="text-lg font-semibold">📨 Follow-up Action</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleFollowUp}
        >
          Send Follow-Up Email
        </button>
      </div>
    </div>
  );
}
