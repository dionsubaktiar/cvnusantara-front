"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

const RecapPage = () => {
  const [formData, setFormData] = useState({
    nopol: "",
    driver: "",
    origin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // if (!formData.nopol.trim()) {
      //   setError("Nopol wajib diisi!");
      //   return;
      // }

      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://backend-cv.nusantaratranssentosa.co.id/api/recap",
          formData
        );
        if (response.data.length > 0) {
          sessionStorage.setItem("recapData", JSON.stringify(response.data));
          router.push("/print-recap"); // Redirect after getting results
        } else {
          setError("Tidak ada data ditemukan.");
        }
      } catch (err) {
        setError("Gagal mengambil data. Coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [formData, router]
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
