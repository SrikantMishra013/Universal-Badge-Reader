interface Props {
  visitor: {
    name: string;
    email: string;
    company: string;
    mobile: string;
    raw: string;
  };
  onConfirm: () => void;
  loading: boolean;
}

const VisitorPreview = ({ visitor, onConfirm, loading }: Props) => {
  return (
    <div className="border p-4 rounded bg-gray-50 space-y-2">
      <h3 className="text-lg font-semibold">Preview Info:</h3>
      <p>
        <strong>Name:</strong> {visitor.name}
      </p>
      <p>
        <strong>Email:</strong> {visitor.email}
      </p>
      <p>
        <strong>Company:</strong> {visitor.company}
      </p>
      <p>
        <strong>Mobile:</strong> {visitor.mobile}
      </p>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  );
};

export default VisitorPreview;
