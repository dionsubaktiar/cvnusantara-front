"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { exportToPDF, exportToExcel } from "../utils/exportUtils";

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
      setFormData({
        nopol: "",
        driver: "",
        origin: "",
        tanggal_start: "",
        tanggal_end: "",
      });
      e.preventDefault();
      setLoading(true);
      setError("");
      setClicked(false);
      setDataExport(null);

      try {
        const response = await axios.post(
          "https://backend-cv.nusantaratranssentosa.co.id/api/recap",
          formData
        );

        if (response.data.length > 0) {
          setDataExport(response.data);
          setClicked(true);
        } else {
          // if (
          //   (formData.tanggal_start != "" && formData.tanggal_end == "") ||
          //   (formData.tanggal_start == "" && formData.tanggal_end != "")
          // ) {
          //   setError("Tanggal awal dan Tanggal akhir tidak boleh kosong");
          //   setClicked(false);
          // } else {
          setClicked(false);
          setError("Tidak ada data ditemukan.");
          // }
        }
      } catch (err) {
        setClicked(false);
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

        {/* Back Button */}
        {clicked ? (
          <div className="flex justify-between items-center">
            <button
              onClick={() => exportToExcel(dataExport)} // Navigate back to home
              className="mt-4 mr-2 bg-green-600 text-white p-2 w-full rounded-lg hover:bg-green-400 transition"
              disabled={!clicked}
            >
              Export Excel
            </button>
            <button
              onClick={() => exportToPDF(dataExport)} // Navigate back to home
              className="mt-4 bg-green-600 text-white p-2 w-full rounded-lg  hover:bg-green-400 transition"
              disabled={!clicked}
            >
              Export PDF
            </button>
          </div>
        ) : null}
        <button
          onClick={() => router.push("/")} // Navigate back to home
          className="mt-4 bg-gray-500 text-white p-2 w-full rounded-lg hover:bg-gray-600 transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default RecapPage;
