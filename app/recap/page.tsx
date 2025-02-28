"use client";

import axios from "axios";
import { useState, useRef, useCallback, useMemo } from "react";

interface Data {
  id: number;
  tanggal: string | null;
  nopol: string;
  driver: string;
  origin: string;
  destinasi: string;
  uj: number;
  harga: number;
  status: string;
  status_sj: string;
  tanggal_update_sj: string | null;
}

const RecapPage = () => {
  const [formData, setFormData] = useState({
    nopol: "",
    driver: "",
    origin: "",
  });
  const [hasilPencarian, setHasilPencarian] = useState<Data[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.nopol.trim()) {
        setError("Nopol wajib diisi!");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://backend-cv.nusantaratranssentosa.co.id/api/recap",
          formData
        );
        setHasilPencarian(response.data);
      } catch (err) {
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

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const hasilTable = useMemo(() => {
    if (!hasilPencarian || hasilPencarian.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-4">
          Tidak ada data ditemukan.
        </p>
      );
    }
    return (
      <div ref={printRef} className="border p-4 mt-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-center mb-2">
          Hasil Pencarian
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Nopol</th>
              <th className="border border-gray-300 p-2">Driver</th>
              <th className="border border-gray-300 p-2">Origin</th>
              <th className="border border-gray-300 p-2">Destinasi</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Status SJ</th>
            </tr>
          </thead>
          <tbody>
            {hasilPencarian.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 p-2">{item.nopol}</td>
                <td className="border border-gray-300 p-2">{item.driver}</td>
                <td className="border border-gray-300 p-2">{item.origin}</td>
                <td className="border border-gray-300 p-2">{item.destinasi}</td>
                <td className="border border-gray-300 p-2">{item.status}</td>
                <td className="border border-gray-300 p-2">{item.status_sj}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white p-2 w-full mt-4 rounded-lg hover:bg-green-600 transition"
        >
          Print as PDF
        </button>
      </div>
    );
  }, [hasilPencarian, handlePrint]);

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
            required
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
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Cari"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {hasilTable}
      </div>
    </div>
  );
};

export default RecapPage;
