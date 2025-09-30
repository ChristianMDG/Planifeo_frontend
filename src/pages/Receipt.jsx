import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { receiptsAPI } from "../services/receiptsAPI";

const Receipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const response = await receiptsAPI.getReceipt(id);
        // Convert blob en URL pour afficher
        const url = URL.createObjectURL(response.data);
        setReceipt(url);
      } catch (err) {
        setError("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [id]);

  if (loading) return <p className="p-8">Loading receipt...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Receipt</h1>
      {receipt.endsWith(".pdf") ? (
        <iframe src={receipt} width="100%" height="600px" title="Receipt" />
      ) : (
        <img src={receipt} alt="Receipt" className="max-w-full h-auto rounded-lg shadow" />
      )}
      <a
        href={receipt}
        download={`receipt_${id}`}
        className="mt-4 px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:bg-[var(--secondary-color)]"
      >
        Télécharger
      </a>
    </div>
  );
};

export default Receipt;
