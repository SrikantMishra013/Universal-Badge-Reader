import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

interface Visitor {
  _id: string;
  name: string;
  email: string;
  company: string;
  mobile: string;
  createdAt?: string;
}

export default function VisitorListPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/visitor");
      setVisitors(res.data as Visitor[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">👥 Visitor List</h1>

        {loading ? (
          <p className="text-lg">Loading visitors...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : visitors.length === 0 ? (
          <p>No visitors found.</p>
        ) : (
          <table className="w-full table-auto bg-white shadow rounded border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2  border">Name</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {visitors.map((v) => (
                <tr key={v._id} className="border-t">
                  <td className="px-4 py-2 border">{v.name}</td>
                  <td className="px-4 py-2 border">{v.company}</td>
                  <td className="px-4 py-2 border">{v.email}</td>
                  <td className="px-4 py-2 border">{v.mobile}</td>
                  <td className="px-4 py-2 border">
                    {v.createdAt ? new Date(v.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/visitor/${v._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View ➤
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
