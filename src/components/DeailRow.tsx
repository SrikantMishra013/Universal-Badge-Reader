const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <p className="text-left">
    <span className="font-medium text-black-600">{label}:</span>{" "}
    <span className="text-gray-800">{value || "—"}</span>
  </p>
);
export default DetailRow;
