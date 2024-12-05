import axios from "axios";
import React, { useEffect, useState } from "react";

interface ViewData {
  id: number;
  closeModal: () => void;
}

interface DataResponse {
  id: number;
  tanggal: string | null;
  nopol: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
  created_at: string | null;
  updated_at: string;
}

const ViewModal: React.FC<ViewData> = ({ id, closeModal }) => {
  const [data, setData] = useState<DataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get<DataResponse>(
        `https://cvnusantara.nusantaratranssentosa.co.id/api/data/${id}`
      );
      setData(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  const formattedDate = data.tanggal
    ? new Date(data.tanggal).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Detail Data</h2>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {data.id}
          </p>
          <p>
            <strong>Tanggal:</strong> {formattedDate}
          </p>
          <p>
            <strong>Nopol:</strong> {data.nopol}
          </p>
          <p>
            <strong>Origin:</strong> {data.origin}
          </p>
          <p>
            <strong>Destinasi:</strong> {data.destinasi}
          </p>
          <p>
            <strong>Uj:</strong> Rp. {data.uj.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Harga:</strong> Rp. {data.harga.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
