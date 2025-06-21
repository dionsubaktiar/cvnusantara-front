"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { exportToPDF, exportToExcel } from "../utils/exportUtils"; // Pastikan path ini benar

const RecapPage = () => {
  const [formData, setFormData] = useState({
    nopol: "",
    driver: "",
    origin: "",
    tanggal_start: "",
    tanggal_end: "",
  });

  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dataExport, setDataExport] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setClicked(false); // Reset clicked state
      setDataExport(null); // Clear previous data on new search

      try {
        const response = await axios.post(
          "https://backend-cv.nusantaratranssentosa.co.id/api/recap",
          formData
        );

        if (response.data.length > 0) {
          setDataExport(response.data);
          setClicked(true); // Set clicked to true only if data is found
        } else {
          setClicked(false); // Ensure clicked is false if no data
          setError("Tidak ada data ditemukan.");
        }
      } catch (err) {
        setClicked(false); // Ensure clicked is false on error
        setError("Gagal mengambil data. Coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper variable to determine if export buttons should be enabled
  const isExportEnabled = clicked || dataExport != null;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-6 mx-3 max-w-lg bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Recap Data
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nopol"
            value={formData.nopol}
            onChange={handleChange}
            placeholder="Nopol"
            className="border p-2 w-full rounded-lg text-black"
          />
          <input
            type="text"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            placeholder="Driver"
            className="border p-2 w-full rounded-lg text-black"
          />
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Origin"
            className="border p-2 w-full rounded-lg text-black"
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="tanggal_start"
              value={formData.tanggal_start}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg text-black"
            />
            <input
              type="date"
              name="tanggal_end"
              value={formData.tanggal_end}
              onChange={handleChange}
              className="border p-2 w-full rounded-lg text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Cari"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {/* Export Buttons */}
        {/* Only show export buttons if there's data to export */}
        {isExportEnabled && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => exportToExcel(dataExport)}
              className={`mr-2 p-2 w-full rounded-lg transition ${
                isExportEnabled
                  ? "bg-green-600 text-white hover:bg-green-400"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isExportEnabled} // Dynamically set disabled
            >
              Export Excel
            </button>
            <button
              onClick={() => exportToPDF(dataExport)}
              className={`p-2 w-full rounded-lg transition ${
                isExportEnabled
                  ? "bg-green-600 text-white hover:bg-green-400"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isExportEnabled} // Dynamically set disabled
            >
              Export PDF
            </button>
          </div>
        )}
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-gray-500 text-white p-2 w-full rounded-lg hover:bg-gray-600 transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default RecapPage;
