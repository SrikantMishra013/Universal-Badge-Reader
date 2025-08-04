import { useState } from "react";

interface Props {
  setVisitorData: (data: {
    name: string;
    email: string;
    company: string;
    mobile: string;
    raw: string;
  }) => void;
}

const ManualEntry = ({ setVisitorData }: Props) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    mobile: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setVisitorData({ ...form, raw: JSON.stringify(form) });
  };

  return (
    <div className="space-y-4">
      <input
        name="name"
        placeholder="Full Name"
        className="w-full border px-3 py-2 rounded"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="company"
        placeholder="Company"
        className="w-full border px-3 py-2 rounded"
        value={form.company}
        onChange={handleChange}
      />
      <input
        name="mobile"
        placeholder="Mobile"
        className="w-full border px-3 py-2 rounded"
        value={form.mobile}
        onChange={handleChange}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Preview
      </button>
    </div>
  );
};

export default ManualEntry;
